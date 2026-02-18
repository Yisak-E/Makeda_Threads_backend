import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  Max,
  MinLength,
  IsArray,
} from 'class-validator';
import { ProductCategory } from '../schemas/products.schema';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ example: 'Royal Elegance Dress' })
  name: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 249.99 })
  price: number;

  @IsString()
  @ApiProperty({ example: 'https://images.unsplash.com/photo-1?w=1080' })
  image: string;

  @IsEnum(ProductCategory)
  @ApiProperty({ enum: ProductCategory, example: ProductCategory.FEMALE })
  category: ProductCategory;

  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 15 })
  stockQuantity: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  @ApiPropertyOptional({ example: 10 })
  discountPercentage?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Luxury evening gown with embroidery.' })
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ example: ['XS', 'S', 'M', 'L'] })
  sizes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiPropertyOptional({ example: ['Gold', 'Black'] })
  colors?: string[];
}
