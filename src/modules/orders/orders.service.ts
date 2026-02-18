import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus, RefundStatus } from './schemas/orders.schema';
import { CreateOrderDto } from './dto/create-orders.dto';
import { Product, ProductDocument } from '../products/schemas/products.schema';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { UpdateOrderStatusDto, RequestRefundDto } from './dto/update-orders.dto';

export interface OrderResponse {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  refundStatus: RefundStatus;
  refundReason?: string;
  date: string;
  items: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: CurrentUserData,
  ): Promise<OrderResponse> {
    if (!createOrderDto.items?.length) {
      throw new BadRequestException('Order items are required');
    }

    const session = await this.connection.startSession();
    try {
      let createdOrder: OrderDocument | null = null;

      await session.withTransaction(async () => {
        const orderItems: Order['items'] = [];
        let total = 0;

        for (const item of createOrderDto.items) {
          const product = await this.productModel
            .findById(item.productId)
            .session(session);

          if (!product || !product.isActive) {
            throw new NotFoundException('Product not found');
          }

          if (product.stockQuantity < item.quantity) {
            throw new BadRequestException('Out of Stock');
          }

          const unitPrice = this.getFinalPrice(product.price, product.discountPercentage);
          total += unitPrice * item.quantity;

          const updated = await this.productModel.updateOne(
            { _id: product._id, stockQuantity: { $gte: item.quantity } },
            { $inc: { stockQuantity: -item.quantity } },
            { session },
          );

          if (updated.modifiedCount === 0) {
            throw new BadRequestException('Out of Stock');
          }

          orderItems.push({
            productId: product._id,
            name: product.name,
            quantity: item.quantity,
            price: unitPrice,
          });
        }

        const orderNumber = this.generateOrderNumber();
        const [order] = await this.orderModel.create(
          [
            {
              orderNumber,
              userId: new Types.ObjectId(user.userId),
              customerName: createOrderDto.customerName,
              customerEmail: createOrderDto.customerEmail,
              total,
              status: OrderStatus.PROCESSING,
              refundStatus: RefundStatus.NONE,
              items: orderItems,
              date: new Date(),
              shippingAddress: createOrderDto.shippingAddress,
              city: createOrderDto.city,
              postalCode: createOrderDto.postalCode,
              country: createOrderDto.country,
            },
          ],
          { session },
        );

        createdOrder = order;
      });

      if (!createdOrder) {
        throw new BadRequestException('Order creation failed');
      }

      return this.toResponse(createdOrder);
    } finally {
      await session.endSession();
    }
  }

  async getMyOrders(user: CurrentUserData): Promise<OrderResponse[]> {
    const orders = await this.orderModel
      .find({
        $or: [
          { userId: new Types.ObjectId(user.userId) },
          { customerEmail: user.email },
        ],
      })
      .sort({ date: -1 });

    return orders.map((order) => this.toResponse(order));
  }

  async getAllOrders(): Promise<OrderResponse[]> {
    const orders = await this.orderModel.find().sort({ date: -1 });
    return orders.map((order) => this.toResponse(order));
  }

  async requestRefund(
    id: string,
    user: CurrentUserData,
    dto: RequestRefundDto,
  ): Promise<OrderResponse> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      order.userId?.toString() !== user.userId &&
      order.customerEmail !== user.email
    ) {
      throw new ForbiddenException('Access denied');
    }

    if (order.refundStatus !== RefundStatus.NONE) {
      throw new BadRequestException('Refund already requested');
    }

    order.refundStatus = RefundStatus.REQUESTED;
    order.refundReason = dto.refundReason;
    await order.save();

    return this.toResponse(order);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<OrderResponse> {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { status: dto.status },
      { new: true },
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.toResponse(order);
  }

  private getFinalPrice(price: number, discountPercentage: number): number {
    if (!discountPercentage) {
      return price;
    }

    const discount = price * (discountPercentage / 100);
    return Number((price - discount).toFixed(2));
  }

  private generateOrderNumber(): string {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `SS${year}${random}`;
  }

  private toResponse(order: OrderDocument): OrderResponse {
    return {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      total: order.total,
      status: order.status,
      refundStatus: order.refundStatus,
      refundReason: order.refundReason,
      date: this.formatDate(order.date),
      items: order.items.length,
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
