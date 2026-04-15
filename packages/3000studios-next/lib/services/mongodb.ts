/**
 * MongoDB Service
 * Handles database operations for products, orders, and analytics
 */

import { Db, MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB
 */
async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MongoDB URI not configured');
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return db;
}

// Analytics Data Models
export interface AnalyticsData {
  totalRevenue: number;
  activeUsers: number;
  storeOrders: number;
  liveViewers: number;
  pageViews: number;
  conversionRate: number;
  timestamp: Date;
}

export interface UserActivity {
  userId: string;
  action: string;
  page: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface User {
  userId: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin' | 'elite';
  subscriptionStatus: 'free' | 'pro' | 'elite';
  stripeCustomerId?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface Order {
  orderId: string;
  userId?: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'paypal' | 'stripe';
  createdAt: Date;
  completedAt?: Date;
}

export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  affiliateLink?: string;
  commission?: number;
  createdAt: Date;
  updatedAt: Date;
}

// User Management
export async function createUser(user: User): Promise<void> {
  const database = await connectToDatabase();
  await database.collection('users').insertOne(user);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const database = await connectToDatabase();
  const user = await database.collection('users').findOne({ email });
  return user as User | null;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  const database = await connectToDatabase();
  await database.collection('users').updateOne({ userId }, { $set: updates });
}

// Analytics Functions
export async function getAnalytics(
  timeRange: 'day' | 'week' | 'month' = 'day'
): Promise<AnalyticsData> {
  try {
    const database = await connectToDatabase();
    const analytics = database.collection('analytics');

    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    const data = await analytics.findOne(
      { timestamp: { $gte: startDate } },
      { sort: { timestamp: -1 } }
    );

    if (!data) {
      // Return default data if none exists
      return {
        totalRevenue: 0,
        activeUsers: 0,
        storeOrders: 0,
        liveViewers: 0,
        pageViews: 0,
        conversionRate: 0,
        timestamp: now,
      };
    }

    return {
      totalRevenue: data.totalRevenue as number,
      activeUsers: data.activeUsers as number,
      storeOrders: data.storeOrders as number,
      liveViewers: data.liveViewers as number,
      pageViews: data.pageViews as number,
      conversionRate: data.conversionRate as number,
      timestamp: data.timestamp as Date,
    };
  } catch (error: unknown) {
    console.error('', error);
    return {
      totalRevenue: 0,
      activeUsers: 0,
      storeOrders: 0,
      liveViewers: 0,
      pageViews: 0,
      conversionRate: 0,
      timestamp: new Date(),
    };
  }
}

/**
 * Get product from MongoDB
 */
export async function getProduct(productId: string): Promise<Product | null> {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('MongoDB URI not configured');
    return null;
  }

  try {
    const database = await connectToDatabase();
    const product = await database.collection('products').findOne({ productId });
    return product as unknown as Product | null;
  } catch (error) {
    console.error('Failed to fetch product', error);
    return null;
  }
}

/**
 * List products from MongoDB
 */
export async function listProducts(limit = 10): Promise<Product[]> {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('MongoDB URI not configured');
    return [];
  }

  try {
    const database = await connectToDatabase();
    const products = await database.collection('products').find({}).limit(limit).toArray();
    return products as unknown as Product[];
  } catch (error) {
    console.error('Failed to list products', error);
    return [];
  }
}

export async function getOrders(limit: number = 10): Promise<Order[]> {
  try {
    const database = await connectToDatabase();
    const orders = database.collection('orders');

    const results = await orders.find({}).sort({ createdAt: -1 }).limit(limit).toArray();

    return results.map((doc) => ({
      orderId: doc.orderId as string,
      userId: doc.userId as string | undefined,
      items: doc.items as Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
      }>,
      total: doc.total as number,
      status: doc.status as 'pending' | 'completed' | 'failed' | 'refunded',
      paymentMethod: doc.paymentMethod as 'paypal' | 'stripe',
      createdAt: doc.createdAt as Date,
      completedAt: doc.completedAt as Date | undefined,
    }));
  } catch (error: unknown) {
    console.error('Failed to fetch orders', error);
    throw new Error('Failed to fetch orders');
  }
}

export async function saveOrder(order: Order): Promise<void> {
  try {
    const database = await connectToDatabase();
    await database.collection('orders').insertOne(order);
  } catch (error: unknown) {
    console.error('Failed to save order', error);
    throw new Error('Failed to save order');
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const database = await connectToDatabase();
    const products = database.collection('products');

    const results = await products.find({ inStock: true }).toArray();
    return results.map((doc) => ({
      productId: doc.productId as string,
      name: doc.name as string,
      description: doc.description as string,
      price: doc.price as number,
      category: doc.category as string,
      inStock: doc.inStock as boolean,
      rating: doc.rating as number,
      reviewCount: doc.reviewCount as number,
      affiliateLink: doc.affiliateLink as string | undefined,
      commission: doc.commission as number | undefined,
      createdAt: doc.createdAt as Date,
      updatedAt: doc.updatedAt as Date,
    }));
  } catch (error: unknown) {
    console.error('Failed to fetch products', error);
    throw new Error('Failed to fetch products');
  }
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  try {
    const database = await connectToDatabase();
    const products = database.collection('products');

    await products.updateOne({ productId }, { $set: { ...updates, updatedAt: new Date() } });
  } catch (error: unknown) {
    console.error('Failed to update product', error);
    throw new Error('Failed to update product');
  }
}

export async function getDashboardStats() {
  try {
    const database = await connectToDatabase();

    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    // Get current month stats
    const currentStats = await database
      .collection('analytics')
      .findOne({ timestamp: { $gte: lastMonth } }, { sort: { timestamp: -1 } });

    // Get order stats
    const ordersCollection = database.collection('orders');
    const totalOrders = await ordersCollection.countDocuments({
      createdAt: { $gte: lastMonth },
      status: 'completed',
    });

    const revenueAgg = await ordersCollection
      .aggregate([
        {
          $match: {
            createdAt: { $gte: lastMonth },
            status: 'completed',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' },
          },
        },
      ])
      .toArray();

    const revenue = revenueAgg[0]?.total || 0;

    return {
      totalRevenue: revenue,
      activeUsers: currentStats?.activeUsers || 0,
      storeOrders: totalOrders,
      liveViewers: currentStats?.liveViewers || 0,
      pageViews: currentStats?.pageViews || 0,
      conversionRate: currentStats?.conversionRate || 0,
    };
  } catch (error: unknown) {
    console.error('Failed to fetch dashboard stats', error);
    throw new Error('Failed to fetch dashboard stats');
  }
}
