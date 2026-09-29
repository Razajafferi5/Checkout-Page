import { Product } from '../models/Product';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { logger } from '../utils/logger';

export const sampleProducts = [
  {
    name: 'AcousticPro Studio Headphones',
    slug: 'acousticpro-studio-headphones',
    description: 'High-fidelity active noise-cancelling wireless over-ear headphones with 40mm beryllium drivers and 30-hour battery life.',
    price: 149.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    category: 'Audio',
    stock: 45,
    active: true,
  },
  {
    name: 'Precision Mech-96 Wireless Keyboard',
    slug: 'precision-mech-96-wireless-keyboard',
    description: 'Custom CNC aluminum mechanical keyboard with hot-swappable lubed switches, south-facing RGB, and multi-device Bluetooth.',
    price: 89.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    category: 'Accessories',
    stock: 60,
    active: true,
  },
  {
    name: 'Apex Horizon Smart Watch Pro',
    slug: 'apex-horizon-smart-watch-pro',
    description: 'Titanium chassis smartwatch featuring sapphire glass, comprehensive ECG sensor, VO2 max tracking, and 7-day battery life.',
    price: 199.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    category: 'Wearables',
    stock: 30,
    active: true,
  },
  {
    name: 'ErgoLift MagSafe Laptop Stand',
    slug: 'ergolift-magsafe-laptop-stand',
    description: 'Aircraft-grade anodized aluminum ergonomic riser with dual-hinge articulation and built-in ventilation channels.',
    price: 49.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    category: 'Workspace',
    stock: 80,
    active: true,
  },
  {
    name: 'HyperDrive 10-in-1 Thunderbolt Hub',
    slug: 'hyperdrive-10-in-1-thunderbolt-hub',
    description: 'Universal USB-C dock with 4K@60Hz HDMI, Gigabit Ethernet, 100W Power Delivery, SD/TF card readers, and audio jack.',
    price: 59.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80',
    category: 'Accessories',
    stock: 55,
    active: true,
  },
  {
    name: 'OmniDesk Minimalist Desk Mat',
    slug: 'omnidesk-minimalist-desk-mat',
    description: 'Eco-certified waterproof vegan leather desk pad with anti-fray micro-stitched edges and non-slip rubber backing.',
    price: 29.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    category: 'Workspace',
    stock: 120,
    active: true,
  },
  {
    name: 'StreamCam 4K Ultra Webcam',
    slug: 'streamcam-4k-ultra-webcam',
    description: 'Ultra HD 4K conference and streaming webcam with dual beamforming microphones, HDR, and auto light correction.',
    price: 119.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80',
    category: 'Electronics',
    stock: 40,
    active: true,
  },
  {
    name: 'NovaBeam Magnetic Desk Light Bar',
    slug: 'novabeam-magnetic-desk-light-bar',
    description: 'Asymmetric optical computer monitor light bar preventing screen glare with touch dimming and temperature control.',
    price: 64.99,
    currency: 'USD',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    category: 'Workspace',
    stock: 50,
    active: true,
  },
];

export async function seedProducts(): Promise<void> {
  logger.info('Checking product catalog in database...');
  for (const item of sampleProducts) {
    await Product.findOneAndUpdate(
      { slug: item.slug },
      { $set: item },
      { upsert: true, new: true }
    );
  }
  const count = await Product.countDocuments();
  logger.info(`Product catalog synchronized. Total active catalog products: ${count}`);
}

async function runStandaloneSeed() {
  try {
    await connectDatabase();
    await seedProducts();
    await disconnectDatabase();
    process.exit(0);
  } catch (err) {
    logger.error('Seed process failed', err);
    process.exit(1);
  }
}

if (require.main === module) {
  runStandaloneSeed();
}
