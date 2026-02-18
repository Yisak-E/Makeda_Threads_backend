import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../modules/users/schemas/users.schema';
import { Product, ProductDocument } from '../modules/products/schemas/products.schema';
import { EXTENDED_PRODUCTS_SEED } from './seed-data/extended-products';
import { Order, OrderDocument, OrderStatus, RefundStatus } from '../modules/orders/schemas/orders.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  private readonly defaultPassword = 'Password123'; // Default password for all seeded users

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async seedAll() {
    this.logger.log('Starting database seeding...');
    
    await this.seedProducts();
    await this.seedUsers();
    await this.seedOrders();
    
    this.logger.log('Database seeding completed!');
    this.logger.log(`Default password for all users: ${this.defaultPassword}`);
  }

  async seedProducts() {
    const count = await this.productModel.countDocuments();
    if (count > 0) {
      this.logger.log('Products already seeded, skipping...');
      return;
    }

    const products = EXTENDED_PRODUCTS_SEED.map((product) => ({
      ...product,
      sizes: product.sizes ?? [],
      colors: product.colors ?? [],
    }));

    await this.productModel.insertMany(products);
    this.logger.log(`Seeded ${products.length} products`);
  }

  async seedUsers() {
    const count = await this.userModel.countDocuments();
    if (count > 0) {
      this.logger.log('Users already seeded, skipping...');
      return;
    }

    const hashedPassword = await bcrypt.hash(this.defaultPassword, 10);

    // MOCK_CUSTOMERS data - mirrors frontend data structure
    const users = [
      {
        email: 'admin@makedathreads.com',
        name: 'Admin User',
        password: hashedPassword,
        role: UserRole.ADMIN,
        phone: '+251911234567',
        address: '123 Bole Road',
        city: 'Addis Ababa',
        postalCode: '1000',
        country: 'Ethiopia',
        isActive: true,
      },
      {
        email: 'abebe.bekele@example.com',
        name: 'Abebe Bekele',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+251912345678',
        address: '456 Piazza Street',
        city: 'Addis Ababa',
        postalCode: '1001',
        country: 'Ethiopia',
        isActive: true,
      },
      {
        email: 'tigist.alemayehu@example.com',
        name: 'Tigist Alemayehu',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+251913456789',
        address: '789 Merkato Avenue',
        city: 'Addis Ababa',
        postalCode: '1002',
        country: 'Ethiopia',
        isActive: true,
      },
      {
        email: 'yohannes.tesfaye@example.com',
        name: 'Yohannes Tesfaye',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+251914567890',
        address: '321 CMC Road',
        city: 'Addis Ababa',
        postalCode: '1003',
        country: 'Ethiopia',
        isActive: true,
      },
      {
        email: 'meron.haile@example.com',
        name: 'Meron Haile',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+251915678901',
        address: '654 Mexico Square',
        city: 'Addis Ababa',
        postalCode: '1004',
        country: 'Ethiopia',
        isActive: true,
      },
      {
        email: 'dawit.solomon@example.com',
        name: 'Dawit Solomon',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+251916789012',
        address: '987 Arat Kilo',
        city: 'Addis Ababa',
        postalCode: '1005',
        country: 'Ethiopia',
        isActive: true,
      },
      {
        email: 'partner@brandpartner.com',
        name: 'Brand Partner',
        password: hashedPassword,
        role: UserRole.BRAND_PARTNER,
        phone: '+251917890123',
        address: '111 Kazanchis',
        city: 'Addis Ababa',
        postalCode: '1006',
        country: 'Ethiopia',
        isActive: true,
      },
      {
        email: 'helen.getachew@example.com',
        name: 'Helen Getachew',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+251918901234',
        address: '222 Sarbet',
        city: 'Addis Ababa',
        postalCode: '1007',
        country: 'Ethiopia',
        isActive: true,
      },
      {
        email: 'samuel.kifle@example.com',
        name: 'Samuel Kifle',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+251919012345',
        address: '333 Legehar',
        city: 'Addis Ababa',
        postalCode: '1008',
        country: 'Ethiopia',
        isActive: true,
      },
      {
        email: 'ruth.менгيstu@example.com',
        name: 'Ruth Mengistu',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+251920123456',
        address: '444 Siddist Kilo',
        city: 'Addis Ababa',
        postalCode: '1009',
        country: 'Ethiopia',
        isActive: true,
      },
    ];

    await this.userModel.insertMany(users);
    this.logger.log(`Seeded ${users.length} users`);
  }

  async seedOrders() {
    const count = await this.orderModel.countDocuments();
    if (count > 0) {
      this.logger.log('Orders already seeded, skipping...');
      return;
    }

    const products = await this.productModel.find().limit(5);
    const users = await this.userModel.find({ role: UserRole.CUSTOMER }).limit(5);

    if (products.length === 0 || users.length === 0) {
      this.logger.warn('Not enough data to seed orders. Skipping...');
      return;
    }

    const orders = [
      {
        orderNumber: this.generateSeedOrderNumber(),
        userId: users[0]._id,
        customerName: users[0].name,
        customerEmail: users[0].email,
        total: 169.98,
        status: OrderStatus.PROCESSING,
        refundStatus: RefundStatus.NONE,
        items: [
          {
            productId: products[0]._id,
            name: products[0].name,
            quantity: 1,
            price: products[0].price,
          },
          {
            productId: products[1]._id,
            name: products[1].name,
            quantity: 1,
            price: products[1].price,
          },
        ],
        date: new Date(),
        shippingAddress: users[0].address,
        city: users[0].city,
        postalCode: users[0].postalCode,
        country: users[0].country,
      },
      {
        orderNumber: this.generateSeedOrderNumber(),
        userId: users[1]._id,
        customerName: users[1].name,
        customerEmail: users[1].email,
        total: 299.99,
        status: OrderStatus.SHIPPED,
        refundStatus: RefundStatus.NONE,
        items: [
          {
            productId: products[2]._id,
            name: products[2].name,
            quantity: 1,
            price: products[2].price,
          },
        ],
        date: new Date(Date.now() - 86400000), // 1 day ago
        shippingAddress: users[1].address,
        city: users[1].city,
        postalCode: users[1].postalCode,
        country: users[1].country,
      },
      {
        orderNumber: this.generateSeedOrderNumber(),
        userId: users[2]._id,
        customerName: users[2].name,
        customerEmail: users[2].email,
        total: 89.98,
        status: OrderStatus.DELIVERED,
        refundStatus: RefundStatus.NONE,
        items: [
          {
            productId: products[3]._id,
            name: products[3].name,
            quantity: 1,
            price: products[3].price,
          },
        ],
        date: new Date(Date.now() - 172800000), // 2 days ago
        shippingAddress: users[2].address,
        city: users[2].city,
        postalCode: users[2].postalCode,
        country: users[2].country,
      },
    ];

    await this.orderModel.insertMany(orders);
    this.logger.log(`Seeded ${orders.length} orders`);
  }

  async clearDatabase() {
    this.logger.warn('Clearing database...');
    await this.userModel.deleteMany({});
    await this.productModel.deleteMany({});
    await this.orderModel.deleteMany({});
    this.logger.warn('Database cleared!');
  }

  async reseed() {
    await this.clearDatabase();
    await this.seedAll();
  }

  private generateSeedOrderNumber(): string {
    const year = new Date().getFullYear().toString().slice(-2);
    const chunk1 = Math.random().toString(36).slice(2, 6).toUpperCase();
    const chunk2 = Math.random().toString(36).slice(2, 4).toUpperCase();
    return `SS${year}${chunk1}${chunk2}`;
  }
}
