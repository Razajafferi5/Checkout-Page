import { Request, Response, NextFunction } from 'express';
import { dataStore } from '../config/dataStore';
import { AppError } from '../middleware/errorHandler';

export async function getAllProducts(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await dataStore.getAllProducts();
    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const product = await dataStore.getProductByIdOrSlug(id);

    if (!product) {
      throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
}
