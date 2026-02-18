import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEmail,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, RefundStatus } from '../schemas/orders.schema';

export class CreateOrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsNumber()
  @Min(0)
  total: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsEnum(RefundStatus)
  @IsOptional()
  refundStatus?: RefundStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  country?: string;
}
