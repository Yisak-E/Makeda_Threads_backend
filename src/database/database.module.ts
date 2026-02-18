import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { User, UserSchema } from '../modules/users/schemas/users.schema';
import { Product, ProductSchema } from '../modules/products/schemas/products.schema';
import { Order, OrderSchema } from '../modules/orders/schemas/orders.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
