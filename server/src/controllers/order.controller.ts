import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Order, IOrderItem } from '../models/Order';
import { dataStore } from '../config/dataStore';
import { generateOrderNumber } from '../utils/orderNumber';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { customer, items } = req.body;

    // 1. Fetch verified products from dataStore
    const productIds: string[] = items.map((i: { productId: string }) => i.productId);
    const dbProducts = await dataStore.getProductsByIds(productIds);

    if (dbProducts.length !== items.length) {
      throw new AppError('One or more selected items are no longer available.', 400, 'PRODUCT_UNAVAILABLE');
    }

    const productMap = new Map(dbProducts.map(p => [p._id.toString(), p]));

    // 2. Server-side calculations
    let calculatedSubtotal = 0;
    const validatedItems: IOrderItem[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new AppError(`Product not found: ${item.productId}`, 400, 'INVALID_PRODUCT');
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}.`,
          400,
          'INSUFFICIENT_STOCK'
        );
      }

      const lineTotal = Number((product.price * item.quantity).toFixed(2));
      calculatedSubtotal += lineTotal;

      validatedItems.push({
        productId: product._id as Types.ObjectId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
        subtotal: lineTotal,
      });
    }

    calculatedSubtotal = Number(calculatedSubtotal.toFixed(2));
    const calculatedTax = Number((calculatedSubtotal * 0.0825).toFixed(2));
    const calculatedShipping = calculatedSubtotal >= 150 ? 0.0 : 9.99;
    const calculatedDiscount = 0.0;
    const calculatedTotal = Number((calculatedSubtotal - calculatedDiscount + calculatedTax + calculatedShipping).toFixed(2));

    const orderNumber = generateOrderNumber();

    const order = new Order({
      orderNumber,
      customer: {
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        shippingAddress: customer.shippingAddress,
        billingAddress: customer.billingAddress || customer.shippingAddress,
      },
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      tax: calculatedTax,
      shipping: calculatedShipping,
      total: calculatedTotal,
      currency: 'USD',
      status: 'PENDING_PAYMENT',
      paymentStatus: 'PENDING',
    });

    const savedOrder = await dataStore.createOrder(order);

    logger.info(`Order created successfully: ${savedOrder.orderNumber}`, {
      orderNumber: savedOrder.orderNumber,
      total: savedOrder.total,
      itemCount: validatedItems.length,
      customerEmail: savedOrder.customer.email,
    });

    res.status(201).json({
      success: true,
      data: savedOrder,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrderByNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderNumber } = req.params;

    const order = await dataStore.getOrderByNumber(orderNumber);
    if (!order) {
      throw new AppError(`Order ${orderNumber} not found`, 404, 'ORDER_NOT_FOUND');
    }

    const payment = await dataStore.getPaymentByOrderId(order._id.toString());

    res.json({
      success: true,
      data: {
        order,
        payment,
      },
    });
  } catch (err) {
    next(err);
  }
}
