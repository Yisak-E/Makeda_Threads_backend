import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  NotificationLog,
  NotificationLogDocument,
  NotificationLogStatus,
  NotificationLogType,
} from './schemas/notification-log.schema';
import { OrderDocument, OrderStatus } from '../orders/schemas/orders.schema';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { User, UserDocument, UserRole } from '../users/schemas/users.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(NotificationLog.name)
    private notificationLogModel: Model<NotificationLogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async logOrderStatusChange(order: OrderDocument, status: OrderStatus) {
    const subject = `Order Status Update - ${order.orderNumber} (${status})`;
    await this.createLog({
      recipient: order.customerEmail,
      subject,
      orderNumber: order.orderNumber,
      status: NotificationLogStatus.SENT,
    });
  }

  async logOrderCreated(order: OrderDocument) {
    const subject = `Order Confirmation - ${order.orderNumber}`;
    await this.createLog({
      recipient: order.customerEmail,
      subject,
      orderNumber: order.orderNumber,
      status: NotificationLogStatus.SENT,
    });
  }

  async logRefundRequested(order: OrderDocument) {
    const subject = `Refund Requested - ${order.orderNumber}`;
    await this.createLog({
      recipient: order.customerEmail,
      subject,
      orderNumber: order.orderNumber,
      status: NotificationLogStatus.PENDING,
    });
  }

  async getLogsForUser(
    user: CurrentUserData,
    recipient?: string,
  ): Promise<NotificationLog[]> {
    const dbUser = await this.userModel.findById(user.userId).lean();
    if (!dbUser) {
      return [];
    }

    const allowedRecipients = new Set<string>([dbUser.email]);
    if (dbUser.phone) {
      allowedRecipients.add(dbUser.phone);
    }

    const isAdmin = user.role === UserRole.ADMIN;

    if (recipient && !isAdmin && !allowedRecipients.has(recipient)) {
      throw new ForbiddenException('Access denied');
    }

    const recipients = recipient
      ? [recipient]
      : Array.from(allowedRecipients.values());

    return this.notificationLogModel
      .find({ recipient: { $in: recipients } })
      .sort({ timestamp: -1 })
      .lean();
  }

  private async createLog(params: {
    recipient: string;
    subject: string;
    orderNumber?: string;
    status: NotificationLogStatus;
  }) {
    const log = new this.notificationLogModel({
      id: this.generateLogId(),
      type: NotificationLogType.EMAIL,
      recipient: params.recipient,
      subject: params.subject,
      timestamp: this.formatTimestamp(new Date()),
      status: params.status,
      orderNumber: params.orderNumber,
    });

    await log.save();
  }

  private generateLogId(): string {
    const chunk = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `notif-${chunk}`;
  }

  private formatTimestamp(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}
