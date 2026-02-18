import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  ORDER_UPDATE = 'order_update',
  PROMOTION = 'promotion',
  SYSTEM = 'system',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: String, enum: NotificationType, default: NotificationType.SYSTEM })
  type: NotificationType;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  orderId?: Types.ObjectId;

  @Prop({ default: Date.now })
  date: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Indexes
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ date: -1 });
