import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

export enum ProductCategory {
  FEMALE = 'Female',
  MALE = 'Male',
  KIDS = 'Kids',
  GENERAL = 'General',
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  image: string;

  @Prop({ type: String, enum: ProductCategory, required: true })
  category: ProductCategory;

  @Prop({ required: true, default: 0 })
  stockQuantity: number;

  @Prop({ default: 0, min: 0, max: 100 })
  discountPercentage: number;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  sizes: string[];

  @Prop({ type: [String], default: [] })
  colors: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ category: 1 });
ProductSchema.index({ name: 'text' });
