import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { ProductCategory } from '../schemas/products.schema';

export class UpdateProductDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(ProductCategory)
  @IsOptional()
  category?: ProductCategory;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercentage?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
