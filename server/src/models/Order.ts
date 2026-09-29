import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  subtotal: number;
}

export interface ICustomerAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ICustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: ICustomerAddress;
  billingAddress: ICustomerAddress;
}

export type OrderStatus = 'PENDING_PAYMENT' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'PAYMENT_FAILED';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'EXPIRED' | 'REFUNDED';

export interface IOrder extends Document {
  orderNumber: string;
  customer: ICustomerInfo;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const AddressSchema = new Schema<ICustomerAddress>(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const CustomerSchema = new Schema<ICustomerInfo>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    shippingAddress: { type: AddressSchema, required: true },
    billingAddress: { type: AddressSchema, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: CustomerSchema, required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD', uppercase: true },
    status: {
      type: String,
      enum: ['PENDING_PAYMENT', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'PAYMENT_FAILED'],
      default: 'PENDING_PAYMENT',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
