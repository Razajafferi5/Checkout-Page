import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export function validateOrderInput(req: Request, _res: Response, next: NextFunction): void {
  const { customer, items } = req.body;

  if (!customer || typeof customer !== 'object') {
    throw new AppError('Customer information is required.', 400, 'INVALID_CUSTOMER');
  }

  const { firstName, lastName, email, phone, shippingAddress } = customer;

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
    throw new AppError('First name is required.', 400, 'INVALID_FIRST_NAME');
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
    throw new AppError('Last name is required.', 400, 'INVALID_LAST_NAME');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    throw new AppError('Please enter a valid email address.', 400, 'INVALID_EMAIL');
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    throw new AppError('Please enter a valid phone number.', 400, 'INVALID_PHONE');
  }

  if (!shippingAddress || typeof shippingAddress !== 'object') {
    throw new AppError('Shipping address is required.', 400, 'INVALID_SHIPPING_ADDRESS');
  }

  const { address, city, state, postalCode, country } = shippingAddress;
  if (!address || !city || !state || !postalCode || !country) {
    throw new AppError('All shipping address fields are required.', 400, 'INCOMPLETE_ADDRESS');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('Cart cannot be empty. Please add at least one item.', 400, 'EMPTY_CART');
  }

  for (const item of items) {
    if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new AppError('Invalid item quantity or product ID in cart.', 400, 'INVALID_ITEM');
    }
  }

  next();
}
