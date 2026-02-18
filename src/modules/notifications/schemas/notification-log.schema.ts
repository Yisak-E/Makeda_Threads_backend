import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationLogDocument = NotificationLog & Document;

export enum NotificationLogType {
  EMAIL = 'email',
  SMS = 'sms',
}

export enum NotificationLogStatus {
  SENT = 'sent',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Schema({ timestamps: true })
export class NotificationLog {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ type: String, enum: NotificationLogType, required: true })
  type: NotificationLogType;

  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  timestamp: string;

  @Prop({ type: String, enum: NotificationLogStatus, required: true })
  status: NotificationLogStatus;

  @Prop()
  orderNumber?: string;
}

export const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog);

// Indexes
NotificationLogSchema.index({ recipient: 1 });
NotificationLogSchema.index({ timestamp: -1 });
