import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { OrderStatus } from '../schemas/orders.schema';

export class RequestRefundDto {
  @IsString()
  @MinLength(5)
  @ApiProperty({ example: 'Size does not fit as expected' })
  refundReason: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.SHIPPED })
  status: OrderStatus;
}
