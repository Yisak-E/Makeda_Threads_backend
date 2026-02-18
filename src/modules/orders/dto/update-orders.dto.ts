import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { OrderStatus } from '../schemas/orders.schema';

export class RequestRefundDto {
  @IsString()
  @MinLength(5)
  refundReason: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
