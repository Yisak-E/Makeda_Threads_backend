import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../src/app.module';
import { createInMemoryMongo } from './utils/test-db';
import { User, UserDocument, UserRole } from '../src/modules/users/schemas/users.schema';

describe('Makeda Threads API (full reader)', () => {
  let app: INestApplication;
  let userModel: Model<UserDocument>;
  let stopMongo: () => Promise<void>;

  beforeAll(async () => {
    const mongo = await createInMemoryMongo();
    stopMongo = mongo.stop;

    process.env.MONGODB_URI = mongo.uri;
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '7d';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    userModel = moduleRef.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterAll(async () => {
    await app.close();
    if (stopMongo) {
      await stopMongo();
    }
  });

  it('reads all key endpoints successfully', async () => {
    const adminPassword = await bcrypt.hash('Password123', 10);
    await userModel.create({
      email: 'reader.admin@email.com',
      name: 'Reader Admin',
      password: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    });

    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'reader.admin@email.com',
        password: 'Password123',
      });

    expect(adminLogin.status).toBe(200);
    const adminToken = adminLogin.body.access_token;

    const productRes = await request(app.getHttpServer())
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Reader Product',
        price: 220,
        image: 'https://images.unsplash.com/photo-1?w=1080',
        category: 'Female',
        stockQuantity: 12,
        discountPercentage: 0,
      });

    expect(productRes.status).toBe(201);

    const customerRegister = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'reader.customer@email.com',
        name: 'Reader Customer',
        password: 'Password123',
      });

    expect(customerRegister.status).toBe(201);
    const customerToken = customerRegister.body.access_token;

    const profileRes = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(profileRes.status).toBe(200);

    const orderRes = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        customerName: 'Reader Customer',
        customerEmail: 'reader.customer@email.com',
        items: [{ productId: productRes.body.id, quantity: 1 }],
        shippingAddress: '15 Admiralty Way, Lekki Phase 1',
        city: 'Lagos',
        postalCode: '101245',
        country: 'Nigeria',
      });

    expect(orderRes.status).toBe(201);

    const refundRes = await request(app.getHttpServer())
      .patch(`/api/v1/orders/${orderRes.body.id}/request-refund`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ refundReason: 'Size does not fit as expected' });

    expect(refundRes.status).toBe(200);

    const statusRes = await request(app.getHttpServer())
      .patch(`/api/v1/orders/${orderRes.body.id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Shipped' });

    expect(statusRes.status).toBe(200);

    const productsRes = await request(app.getHttpServer())
      .get('/api/v1/products');

    expect(productsRes.status).toBe(200);
    expect(Array.isArray(productsRes.body)).toBe(true);

    const searchRes = await request(app.getHttpServer())
      .get('/api/v1/products/search')
      .query({ query: 'Reader', category: 'Female' });

    expect(searchRes.status).toBe(200);

    const myOrdersRes = await request(app.getHttpServer())
      .get('/api/v1/orders/my-orders')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(myOrdersRes.status).toBe(200);

    const allOrdersRes = await request(app.getHttpServer())
      .get('/api/v1/orders/admin/all')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(allOrdersRes.status).toBe(200);

    const notificationsRes = await request(app.getHttpServer())
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(notificationsRes.status).toBe(200);

    const healthRes = await request(app.getHttpServer())
      .get('/api/v1');

    expect(healthRes.status).toBe(200);
  });
});
