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
        name: 'Premium Habesha Kemis - White Gold',
        price: 199.99,
        image: '/products/habesha-kemis-2.jpg',
        category: ProductCategory.FEMALE,
        stockQuantity: 15,
        discountPercentage: 0,
        description: 'Premium white Habesha dress with gold accents',
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
        name: 'Men\'s Formal Ethiopian Suit',
        price: 199.99,
        image: '/products/mens-suit-1.jpg',
        category: ProductCategory.MALE,
        stockQuantity: 15,
        discountPercentage: 5,
        description: 'Premium traditional Ethiopian formal suit',
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
        name: 'Kids Habesha Dress Set',
        price: 59.99,
        image: '/products/kids-outfit-2.jpg',
        category: ProductCategory.KIDS,
        stockQuantity: 25,
        discountPercentage: 15,
        description: 'Complete traditional dress set for kids',
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
        name: 'Premium Netela - Handwoven',
        price: 69.99,
        image: '/products/netela-2.jpg',
        category: ProductCategory.GENERAL,
        stockQuantity: 30,
        discountPercentage: 0,
        description: 'Premium handwoven Ethiopian shawl',
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
        name: 'Traditional Ethiopian Scarf',
        price: 29.99,
        image: '/products/scarf-1.jpg',
        category: ProductCategory.GENERAL,
        stockQuantity: 60,
        discountPercentage: 25,
        description: 'Colorful traditional Ethiopian scarf',
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
      {
        orderNumber: `ORD-${Date.now()}-003`,
        userId: users[2]._id,
        customerName: users[2].name,
        customerEmail: users[2].email,
        total: 89.98,
        status: OrderStatus.DELIVERED,
        refundStatus: RefundStatus.NONE,
        items: [
          {
            productId: products[3]._id,
            productName: products[3].name,
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
}
