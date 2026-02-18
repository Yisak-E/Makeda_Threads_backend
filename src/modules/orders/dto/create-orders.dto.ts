import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsString()
  @ApiProperty({ example: '66f1d2e7d12a1c1234567890' })
  productId: string;

  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 2 })
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ example: 'Amara Okafor' })
  customerName: string;

  @IsEmail()
  @ApiProperty({ example: 'amara.okafor@email.com' })
  customerEmail: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ApiProperty({ type: [CreateOrderItemDto] })
  items: CreateOrderItemDto[];

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '15 Admiralty Way, Lekki Phase 1' })
  shippingAddress?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Lagos' })
  city?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '101245' })
  postalCode?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Nigeria' })
  country?: string;
}
