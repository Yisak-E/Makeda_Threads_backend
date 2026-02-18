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

    // MOCK_CUSTOMERS + DemoGuide accounts
    const users = [
      {
        email: 'admin@makedathreads.com',
        name: 'Admin User',
        password: hashedPassword,
        role: UserRole.ADMIN,
        phone: '+1 000 000 0000',
        address: 'Admin HQ',
        city: 'London',
        postalCode: 'SW1A 1AA',
        country: 'United Kingdom',
        isActive: true,
      },
      {
        email: 'partner@brandpartner.com',
        name: 'Brand Partner',
        password: hashedPassword,
        role: UserRole.BRAND_PARTNER,
        phone: '+1 000 000 0001',
        address: 'Partner Office',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        isActive: true,
      },
      {
        email: 'amara.okafor@email.com',
        name: 'Amara Okafor',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+234 801 234 5678',
        address: '15 Admiralty Way, Lekki Phase 1',
        city: 'Lagos',
        postalCode: '101245',
        country: 'Nigeria',
        isActive: true,
      },
      {
        email: 'kwame.mensah@email.com',
        name: 'Kwame Mensah',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+233 24 567 8901',
        address: '22 Airport Residential Area',
        city: 'Accra',
        postalCode: 'GA-123-4567',
        country: 'Ghana',
        isActive: true,
      },
      {
        email: 'zara.nkosi@email.com',
        name: 'Zara Nkosi',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+27 71 234 5678',
        address: '45 Nelson Mandela Square, Sandton',
        city: 'Johannesburg',
        postalCode: '2196',
        country: 'South Africa',
        isActive: true,
      },
      {
        email: 'malik.hassan@email.com',
        name: 'Malik Hassan',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+254 712 345 678',
        address: '78 Kimathi Street, Westlands',
        city: 'Nairobi',
        postalCode: '00100',
        country: 'Kenya',
        isActive: true,
      },
      {
        email: 'fatima.diop@email.com',
        name: 'Fatima Diop',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+221 77 123 4567',
        address: '12 Avenue Hassan II',
        city: 'Dakar',
        postalCode: '11500',
        country: 'Senegal',
        isActive: true,
      },
      {
        email: 'themba.khumalo@email.com',
        name: 'Themba Khumalo',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+27 82 345 6789',
        address: '33 Long Street, City Centre',
        city: 'Cape Town',
        postalCode: '8001',
        country: 'South Africa',
        isActive: true,
      },
      {
        email: 'aisha.adebayo@email.com',
        name: 'Aisha Adebayo',
        password: hashedPassword,
        role: UserRole.CUSTOMER,
        phone: '+234 803 456 7890',
        address: '56 Victoria Island Annex',
        city: 'Lagos',
        postalCode: '101241',
        country: 'Nigeria',
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
