import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
}

export enum RefundStatus {
  NONE = 'None',
  REQUESTED = 'Requested',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true })
  total: number;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: OrderStatus;

  @Prop({ type: String, enum: RefundStatus, default: RefundStatus.NONE })
  refundStatus: RefundStatus;

  @Prop()
  refundReason?: string;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  shippingAddress?: string;

  @Prop()
  city?: string;

  @Prop()
  postalCode?: string;

  @Prop()
  country?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ date: -1 });
