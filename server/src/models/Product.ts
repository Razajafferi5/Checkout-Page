import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  stock: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
    image: { type: String, required: true },
    category: { type: String, required: true, index: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
