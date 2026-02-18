import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../modules/users/schemas/users.schema';
import { Product, ProductDocument, ProductCategory } from '../modules/products/schemas/products.schema';
import { Order, OrderDocument, OrderStatus, RefundStatus } from '../modules/orders/schemas/orders.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

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
  }

  async seedProducts() {
    const count = await this.productModel.countDocuments();
    if (count > 0) {
      this.logger.log('Products already seeded, skipping...');
      return;
    }

    const products = [
      {
        name: 'Ethiopian Traditional Dress - Habesha Kemis',
        price: 129.99,
        image: '/products/habesha-kemis-1.jpg',
        category: ProductCategory.FEMALE,
        stockQuantity: 25,
        discountPercentage: 15,
        description: 'Elegant traditional Ethiopian dress with intricate embroidery',
      },
      {
        name: 'Men\'s Ethiopian Shirt - Kitfo Design',
        price: 79.99,
        image: '/products/mens-shirt-1.jpg',
        category: ProductCategory.MALE,
        stockQuantity: 40,
        discountPercentage: 0,
        description: 'Traditional Ethiopian men\'s shirt with modern fit',
      },
      {
        name: 'Kids Traditional Outfit',
        price: 49.99,
        image: '/products/kids-outfit-1.jpg',
        category: ProductCategory.KIDS,
        stockQuantity: 30,
        discountPercentage: 20,
        description: 'Adorable traditional outfit for children',
      },
      {
        name: 'Ethiopian Cotton Shawl - Netela',
        price: 39.99,
        image: '/products/netela-1.jpg',
        category: ProductCategory.GENERAL,
        stockQuantity: 50,
        discountPercentage: 10,
        description: 'Handwoven Ethiopian cotton shawl',
      },
      {
        name: 'Wedding Habesha Dress',
        price: 299.99,
        image: '/products/wedding-dress-1.jpg',
        category: ProductCategory.FEMALE,
        stockQuantity: 10,
        discountPercentage: 0,
        description: 'Luxurious wedding dress with gold embroidery',
      },
      {
        name: 'Men\'s Formal Ethiopian Suit',
        price: 199.99,
        image: '/products/mens-suit-1.jpg',
        category: ProductCategory.MALE,
        stockQuantity: 15,
        discountPercentage: 5,
        description: 'Premium traditional Ethiopian formal suit',
      },
    ];

    await this.productModel.insertMany(products);
    this.logger.log(`Seeded ${products.length} products`);
  }

  async seedUsers() {
    const count = await this.userModel.countDocuments();
    if (count > 0) {
      this.logger.log('Users already seeded, skipping...');
      return;
    }

    const hashedPassword = await bcrypt.hash('Password123', 10);

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
        email: 'customer1@example.com',
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
        email: 'customer2@example.com',
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
        email: 'partner@brandpartner.com',
        name: 'Brand Partner',
        password: hashedPassword,
        role: UserRole.BRAND_PARTNER,
        phone: '+251914567890',
        address: '321 CMC Road',
        city: 'Addis Ababa',
        postalCode: '1003',
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

    const products = await this.productModel.find().limit(3);
    const users = await this.userModel.find({ role: UserRole.CUSTOMER }).limit(2);

    if (products.length === 0 || users.length === 0) {
      this.logger.warn('Not enough data to seed orders. Skipping...');
      return;
    }

    const orders = [
      {
        orderNumber: `ORD-${Date.now()}-001`,
        userId: users[0]._id,
        customerName: users[0].name,
        customerEmail: users[0].email,
        total: 169.98,
        status: OrderStatus.PROCESSING,
        refundStatus: RefundStatus.NONE,
        items: [
          {
            productId: products[0]._id,
            productName: products[0].name,
            quantity: 1,
            price: products[0].price,
          },
          {
            productId: products[1]._id,
            productName: products[1].name,
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
        orderNumber: `ORD-${Date.now()}-002`,
        userId: users[1]._id,
        customerName: users[1].name,
        customerEmail: users[1].email,
        total: 299.99,
        status: OrderStatus.SHIPPED,
        refundStatus: RefundStatus.NONE,
        items: [
          {
            productId: products[2]._id,
            productName: products[2].name,
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
}
