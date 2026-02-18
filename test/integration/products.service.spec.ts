import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from '../../src/modules/products/products.module';
import { ProductsService } from '../../src/modules/products/products.service';
import { createInMemoryMongo } from '../utils/test-db';
import { ProductCategory } from '../../src/modules/products/schemas/products.schema';

describe('ProductsService (integration)', () => {
  let service: ProductsService;
  let stopMongo: () => Promise<void>;

  beforeAll(async () => {
    const mongo = await createInMemoryMongo();
    stopMongo = mongo.stop;

    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongo.uri),
        ProductsModule,
      ],
    }).compile();

    service = moduleRef.get(ProductsService);
  });

  afterAll(async () => {
    if (stopMongo) {
      await stopMongo();
    }
  });

  it('marks low stock correctly', async () => {
    const product = await service.create({
      name: 'Low Stock Bag',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1?w=1080',
      category: ProductCategory.GENERAL,
      stockQuantity: 5,
      discountPercentage: 0,
    });

    expect(product.lowStock).toBe(true);
    expect(product.stockStatus).toBe('low_stock');
    expect(product.lowStockCount).toBe(5);
  });

  it('throws out of stock for zero quantity', async () => {
    const product = await service.create({
      name: 'Out of Stock Item',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-2?w=1080',
      category: ProductCategory.GENERAL,
      stockQuantity: 0,
      discountPercentage: 0,
    });

    expect(() => service.ensureAvailable(product as any)).toThrow('Out of Stock');
  });
});
