import mongoose, { Types } from 'mongoose';
import { Product, IProduct } from '../models/Product';
import { Order, IOrder, PaymentStatus, OrderStatus, ITimelineEvent } from '../models/Order';
import { Payment, IPayment } from '../models/Payment';
import { WebhookEvent, IWebhookEvent } from '../models/WebhookEvent';
import { User, IUser, hashPassword } from '../models/User';
import { AuditLog, IAuditLog } from '../models/AuditLog';
import { sampleProducts } from '../scripts/seed';
import { logger } from '../utils/logger';
import { ENV } from './env';

// In-Memory Storage Containers
const memoryProducts: Map<string, IProduct> = new Map();
const memoryOrders: Map<string, IOrder> = new Map();
const memoryPayments: Map<string, IPayment> = new Map();
const memoryWebhookEvents: Map<string, IWebhookEvent> = new Map();
const memoryUsers: Map<string, IUser> = new Map();
const memoryAuditLogs: IAuditLog[] = [];

function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function initInMemoryUsers(): Promise<void> {
  if (memoryUsers.size === 0) {
    const opsPasswordHash = await hashPassword(ENV.OPERATIONS_ADMIN_PASSWORD);
    const sandboxPasswordHash = await hashPassword(ENV.SANDBOX_ADMIN_PASSWORD);

    const opsUser = new User({
      _id: new Types.ObjectId(),
      firstName: 'Operations',
      lastName: 'Manager',
      email: ENV.OPERATIONS_ADMIN_EMAIL.toLowerCase(),
      passwordHash: opsPasswordHash,
      role: 'OPERATIONS',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const sandboxUser = new User({
      _id: new Types.ObjectId(),
      firstName: 'Sandbox',
      lastName: 'Admin',
      email: ENV.SANDBOX_ADMIN_EMAIL.toLowerCase(),
      passwordHash: sandboxPasswordHash,
      role: 'SANDBOX_ADMIN',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    memoryUsers.set(opsUser.email, opsUser);
    memoryUsers.set(opsUser._id.toString(), opsUser);
    memoryUsers.set(sandboxUser.email, sandboxUser);
    memoryUsers.set(sandboxUser._id.toString(), sandboxUser);

    logger.info('In-memory internal users initialized (ops@payflow.internal, sandbox@payflow.internal).');
  }
}

export function initInMemoryData(): void {
  initInMemoryUsers().catch(err => logger.error('Failed to init in-memory users', err));
  if (memoryProducts.size === 0) {
    logger.info('Initializing in-memory product catalog with 8 premium products...');
    sampleProducts.forEach((item, index) => {
      const id = new Types.ObjectId().toString();
      const productDoc = new Product({
        _id: id,
        ...item,
        createdAt: new Date(Date.now() - (index + 1) * 3600000),
        updatedAt: new Date(),
      });
      memoryProducts.set(id, productDoc);
    });
    logger.info(`In-memory product catalog initialized: ${memoryProducts.size} active items.`);
  }
}

export const dataStore = {
  // PRODUCTS
  async getAllProducts(): Promise<IProduct[]> {
    if (isMongoConnected()) {
      return Product.find({ active: true }).sort({ createdAt: -1 });
    }
    initInMemoryData();
    return Array.from(memoryProducts.values()).filter(p => p.active);
  },

  async getProductByIdOrSlug(idOrSlug: string): Promise<IProduct | null> {
    if (isMongoConnected()) {
      const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
      return isObjectId ? Product.findById(idOrSlug) : Product.findOne({ slug: idOrSlug });
    }
    initInMemoryData();
    const list = Array.from(memoryProducts.values());
    return list.find(p => p._id.toString() === idOrSlug || p.slug === idOrSlug) || null;
  },

  async getProductsByIds(ids: string[]): Promise<IProduct[]> {
    if (isMongoConnected()) {
      const objectIds = ids.map(id => new Types.ObjectId(id));
      return Product.find({ _id: { $in: objectIds }, active: true });
    }
    initInMemoryData();
    return Array.from(memoryProducts.values()).filter(p => ids.includes(p._id.toString()) && p.active);
  },

  async seedProducts(): Promise<number> {
    if (isMongoConnected()) {
      for (const item of sampleProducts) {
        await Product.findOneAndUpdate({ slug: item.slug }, { $set: item }, { upsert: true, new: true });
      }
      return Product.countDocuments();
    }
    memoryProducts.clear();
    initInMemoryData();
    return memoryProducts.size;
  },

  // ORDERS
  async createOrder(orderDoc: IOrder): Promise<IOrder> {
    if (isMongoConnected()) {
      return orderDoc.save();
    }
    if (!orderDoc._id) {
      orderDoc._id = new Types.ObjectId();
    }
    orderDoc.createdAt = new Date();
    orderDoc.updatedAt = new Date();
    memoryOrders.set(orderDoc._id.toString(), orderDoc);
    memoryOrders.set(orderDoc.orderNumber, orderDoc);
    return orderDoc;
  },

  async getOrderByNumber(orderNumber: string): Promise<IOrder | null> {
    if (isMongoConnected()) {
      return Order.findOne({ orderNumber });
    }
    return memoryOrders.get(orderNumber) || null;
  },

  async getOrderById(id: string): Promise<IOrder | null> {
    if (isMongoConnected()) {
      return Order.findById(id);
    }
    return memoryOrders.get(id) || null;
  },

  async updateOrderStatus(orderNumber: string, status: OrderStatus, paymentStatus: PaymentStatus): Promise<IOrder | null> {
    if (isMongoConnected()) {
      const order = await Order.findOne({ orderNumber });
      if (order) {
        order.status = status;
        order.paymentStatus = paymentStatus;
        await order.save();
      }
      return order;
    }
    const order = memoryOrders.get(orderNumber);
    if (order) {
      order.status = status;
      order.paymentStatus = paymentStatus;
      order.updatedAt = new Date();
      memoryOrders.set(orderNumber, order);
      memoryOrders.set(order._id.toString(), order);
    }
    return order || null;
  },

  async getAllOrders(status?: string, search?: string, skip = 0, limit = 50): Promise<{ orders: IOrder[]; total: number }> {
    if (isMongoConnected()) {
      const query: Record<string, unknown> = {};
      if (status && status !== 'ALL') query.status = status;
      if (search) {
        query.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { 'customer.email': { $regex: search, $options: 'i' } },
        ];
      }
      const [orders, total] = await Promise.all([
        Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Order.countDocuments(query),
      ]);
      return { orders, total };
    }

    let list = Array.from(new Set(memoryOrders.values()));
    if (status && status !== 'ALL') {
      list = list.filter(o => o.status === status || o.paymentStatus === status);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        o =>
          o.orderNumber.toLowerCase().includes(s) ||
          o.customer.email.toLowerCase().includes(s) ||
          o.customer.firstName.toLowerCase().includes(s) ||
          o.customer.lastName.toLowerCase().includes(s)
      );
    }
    const total = list.length;
    const orders = list.slice(skip, skip + limit);
    return { orders, total };
  },

  // PAYMENTS
  async createPayment(paymentDoc: IPayment): Promise<IPayment> {
    if (isMongoConnected()) {
      return paymentDoc.save();
    }
    if (!paymentDoc._id) {
      paymentDoc._id = new Types.ObjectId();
    }
    paymentDoc.createdAt = new Date();
    paymentDoc.updatedAt = new Date();
    memoryPayments.set(paymentDoc._id.toString(), paymentDoc);
    memoryPayments.set(paymentDoc.providerPaymentId, paymentDoc);
    return paymentDoc;
  },

  async getPaymentByIdOrProviderId(idOrProviderId: string): Promise<IPayment | null> {
    if (isMongoConnected()) {
      const isObjectId = idOrProviderId.match(/^[0-9a-fA-F]{24}$/);
      return Payment.findOne({
        $or: [
          { _id: isObjectId ? idOrProviderId : null },
          { providerPaymentId: idOrProviderId },
        ],
      });
    }
    return (
      memoryPayments.get(idOrProviderId) ||
      Array.from(memoryPayments.values()).find(
        p => p._id.toString() === idOrProviderId || p.providerPaymentId === idOrProviderId
      ) ||
      null
    );
  },

  async getPaymentByOrderId(orderId: string): Promise<IPayment | null> {
    if (isMongoConnected()) {
      return Payment.findOne({ orderId }).sort({ createdAt: -1 });
    }
    return (
      Array.from(memoryPayments.values()).find(p => p.orderId.toString() === orderId) || null
    );
  },

  async updatePayment(paymentDoc: IPayment): Promise<IPayment> {
    if (isMongoConnected()) {
      return paymentDoc.save();
    }
    paymentDoc.updatedAt = new Date();
    memoryPayments.set(paymentDoc._id.toString(), paymentDoc);
    memoryPayments.set(paymentDoc.providerPaymentId, paymentDoc);
    return paymentDoc;
  },

  async getAllPayments(status?: string, search?: string, skip = 0, limit = 50): Promise<{ payments: IPayment[]; total: number }> {
    if (isMongoConnected()) {
      const query: Record<string, unknown> = {};
      if (status && status !== 'ALL') query.status = status;
      if (search) {
        query.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { providerPaymentId: { $regex: search, $options: 'i' } },
        ];
      }
      const [payments, total] = await Promise.all([
        Payment.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Payment.countDocuments(query),
      ]);
      return { payments, total };
    }

    let list = Array.from(new Set(memoryPayments.values()));
    if (status && status !== 'ALL') {
      list = list.filter(p => p.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        p =>
          p.orderNumber.toLowerCase().includes(s) ||
          p.providerPaymentId.toLowerCase().includes(s) ||
          (p.providerReference && p.providerReference.toLowerCase().includes(s))
      );
    }
    const total = list.length;
    const payments = list.slice(skip, skip + limit);
    return { payments, total };
  },

  async getPaymentStats(): Promise<{
    totalOrders: number;
    successfulPayments: number;
    pendingPayments: number;
    failedPayments: number;
    cancelledPayments: number;
    totalRevenue: number;
  }> {
    if (isMongoConnected()) {
      const [totalOrders, paidPayments, pendingPayments, failedPayments, cancelledPayments] = await Promise.all([
        Order.countDocuments(),
        Payment.countDocuments({ status: 'PAID' }),
        Payment.countDocuments({ status: 'PENDING' }),
        Payment.countDocuments({ status: 'FAILED' }),
        Payment.countDocuments({ status: 'CANCELLED' }),
      ]);
      const revenueAggregation = await Payment.aggregate([
        { $match: { status: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      const totalRevenue = revenueAggregation.length > 0 ? Number(revenueAggregation[0].total.toFixed(2)) : 0;
      return { totalOrders, successfulPayments: paidPayments, pendingPayments, failedPayments, cancelledPayments, totalRevenue };
    }

    const uniqueOrders = new Set(Array.from(memoryOrders.values()).map(o => o.orderNumber));
    const payments = Array.from(new Set(memoryPayments.values()));
    const successfulPayments = payments.filter(p => p.status === 'PAID').length;
    const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
    const failedPayments = payments.filter(p => p.status === 'FAILED').length;
    const cancelledPayments = payments.filter(p => p.status === 'CANCELLED').length;
    const totalRevenue = Number(
      payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0).toFixed(2)
    );

    return {
      totalOrders: uniqueOrders.size,
      successfulPayments,
      pendingPayments,
      failedPayments,
      cancelledPayments,
      totalRevenue,
    };
  },

  // WEBHOOK EVENTS
  async findWebhookEvent(provider: string, eventId: string): Promise<IWebhookEvent | null> {
    if (isMongoConnected()) {
      return WebhookEvent.findOne({ provider, eventId });
    }
    return memoryWebhookEvents.get(`${provider}_${eventId}`) || null;
  },

  async saveWebhookEvent(eventDoc: IWebhookEvent): Promise<IWebhookEvent> {
    if (isMongoConnected()) {
      return eventDoc.save();
    }
    if (!eventDoc._id) {
      eventDoc._id = new Types.ObjectId();
    }
    memoryWebhookEvents.set(`${eventDoc.provider}_${eventDoc.eventId}`, eventDoc);
    return eventDoc;
  },

  async getAllWebhookEvents(
    limit: number = 50,
    skip: number = 0
  ): Promise<{ events: IWebhookEvent[]; total: number }> {
    if (isMongoConnected()) {
      const [events, total] = await Promise.all([
        WebhookEvent.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        WebhookEvent.countDocuments(),
      ]);
      return { events, total };
    }
    const list = Array.from(memoryWebhookEvents.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const total = list.length;
    const events = list.slice(skip, skip + limit);
    return { events, total };
  },

  // USERS & AUTHENTICATION
  async findUserByEmail(email: string): Promise<IUser | null> {
    const normalized = email.toLowerCase().trim();
    if (isMongoConnected()) {
      return User.findOne({ email: normalized });
    }
    await initInMemoryUsers();
    return memoryUsers.get(normalized) || null;
  },

  async findUserById(id: string): Promise<IUser | null> {
    if (isMongoConnected()) {
      return User.findById(id);
    }
    await initInMemoryUsers();
    return memoryUsers.get(id) || null;
  },

  async createUser(userDoc: IUser): Promise<IUser> {
    if (isMongoConnected()) {
      return userDoc.save();
    }
    if (!userDoc._id) {
      userDoc._id = new Types.ObjectId();
    }
    userDoc.createdAt = new Date();
    userDoc.updatedAt = new Date();
    memoryUsers.set(userDoc.email.toLowerCase(), userDoc);
    memoryUsers.set(userDoc._id.toString(), userDoc);
    return userDoc;
  },

  async updateUser(userDoc: IUser): Promise<IUser> {
    userDoc.updatedAt = new Date();
    if (isMongoConnected()) {
      return userDoc.save();
    }
    memoryUsers.set(userDoc.email.toLowerCase(), userDoc);
    memoryUsers.set(userDoc._id.toString(), userDoc);
    return userDoc;
  },

  async seedUsers(): Promise<{ opsUser: IUser; sandboxUser: IUser }> {
    const opsPasswordHash = await hashPassword(ENV.OPERATIONS_ADMIN_PASSWORD);
    const sandboxPasswordHash = await hashPassword(ENV.SANDBOX_ADMIN_PASSWORD);

    if (isMongoConnected()) {
      const opsUser = await User.findOneAndUpdate(
        { email: ENV.OPERATIONS_ADMIN_EMAIL.toLowerCase() },
        {
          $set: {
            firstName: 'Operations',
            lastName: 'Manager',
            passwordHash: opsPasswordHash,
            role: 'OPERATIONS',
            active: true,
          },
        },
        { upsert: true, new: true }
      );

      const sandboxUser = await User.findOneAndUpdate(
        { email: ENV.SANDBOX_ADMIN_EMAIL.toLowerCase() },
        {
          $set: {
            firstName: 'Sandbox',
            lastName: 'Admin',
            passwordHash: sandboxPasswordHash,
            role: 'SANDBOX_ADMIN',
            active: true,
          },
        },
        { upsert: true, new: true }
      );

      logger.info('Database internal users seeded successfully.');
      return { opsUser, sandboxUser };
    }

    await initInMemoryUsers();
    const opsUser = memoryUsers.get(ENV.OPERATIONS_ADMIN_EMAIL.toLowerCase())!;
    const sandboxUser = memoryUsers.get(ENV.SANDBOX_ADMIN_EMAIL.toLowerCase())!;
    return { opsUser, sandboxUser };
  },

  // AUDIT LOGS
  async saveAuditLog(logDoc: IAuditLog): Promise<IAuditLog> {
    if (isMongoConnected()) {
      return logDoc.save();
    }
    if (!logDoc._id) {
      logDoc._id = new Types.ObjectId();
    }
    (logDoc as any).createdAt = new Date();
    memoryAuditLogs.unshift(logDoc);
    if (memoryAuditLogs.length > 500) {
      memoryAuditLogs.pop();
    }
    return logDoc;
  },

  async getAuditLogs(
    limit: number = 50,
    skip: number = 0
  ): Promise<{ logs: IAuditLog[]; total: number }> {
    if (isMongoConnected()) {
      const [logs, total] = await Promise.all([
        AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        AuditLog.countDocuments(),
      ]);
      return { logs, total };
    }
    const total = memoryAuditLogs.length;
    const logs = memoryAuditLogs.slice(skip, skip + limit);
    return { logs, total };
  },

  // OPERATIONAL HELPERS (Timeline & Notes)
  async addOrderNote(orderNumber: string, text: string, author: string): Promise<IOrder | null> {
    const order = await this.getOrderByNumber(orderNumber);
    if (!order) return null;

    if (!order.notes) order.notes = [];
    order.notes.push({ text, author, createdAt: new Date() });
    return this.createOrder(order);
  },

  async addOrderTimeline(orderNumber: string, event: ITimelineEvent): Promise<IOrder | null> {
    const order = await this.getOrderByNumber(orderNumber);
    if (!order) return null;

    if (!order.timeline) order.timeline = [];
    order.timeline.push(event);
    return this.createOrder(order);
  },

  async addPaymentTimeline(paymentIdOrProviderId: string, event: ITimelineEvent): Promise<IPayment | null> {
    const payment = await this.getPaymentByIdOrProviderId(paymentIdOrProviderId);
    if (!payment) return null;

    if (!payment.timeline) payment.timeline = [];
    payment.timeline.push(event);
    return this.updatePayment(payment);
  },
};
