import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductCategory,
  ProductDocument,
} from './schemas/products.schema';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';

export interface ProductResponse extends Product {
  id: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  lowStock: boolean;
  lowStockCount: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async findAll(category?: ProductCategory): Promise<ProductResponse[]> {
    const filter: Record<string, unknown> = { isActive: true };
    if (category) {
      filter.category = category;
    }

    const products = await this.productModel.find(filter).sort({ createdAt: -1 });
    return products.map((product) => this.toResponse(product));
  }

  async search(
    query?: string,
    category?: ProductCategory,
  ): Promise<ProductResponse[]> {
    const filter: Record<string, unknown> = { isActive: true };

    if (query) {
      filter.name = { $regex: query, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    const products = await this.productModel.find(filter).sort({ createdAt: -1 });
    return products.map((product) => this.toResponse(product));
  }

  async findOne(id: string): Promise<ProductResponse> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.toResponse(product);
  }

  async create(createProductDto: CreateProductDto): Promise<ProductResponse> {
    const product = new this.productModel({
      ...createProductDto,
      sizes: createProductDto.sizes ?? [],
      colors: createProductDto.colors ?? [],
      isActive: true,
    });

    const saved = await product.save();
    return this.toResponse(saved);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponse> {
    const updated = await this.productModel.findByIdAndUpdate(
      id,
      {
        ...updateProductDto,
        ...(updateProductDto.sizes ? { sizes: updateProductDto.sizes } : {}),
        ...(updateProductDto.colors ? { colors: updateProductDto.colors } : {}),
      },
      { returnDocument: 'after' },
    );

    if (!updated) {
      throw new NotFoundException('Product not found');
    }

    return this.toResponse(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Product not found');
    }
  }

  ensureAvailable(product: ProductDocument): void {
    if (product.stockQuantity <= 0) {
      throw new BadRequestException('Out of Stock');
    }
  }

  private toResponse(product: ProductDocument): ProductResponse {
    const stockStatus = this.getStockStatus(product.stockQuantity);
    const lowStock = stockStatus === 'low_stock';
    const lowStockCount = lowStock ? product.stockQuantity : 0;

    return {
      ...(product.toObject() as Product),
      id: product._id.toString(),
      stockStatus,
      lowStock,
      lowStockCount,
    } as ProductResponse;
  }

  private getStockStatus(
    stockQuantity: number,
  ): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (stockQuantity <= 0) {
      return 'out_of_stock';
    }
    if (stockQuantity <= 10) {
      return 'low_stock';
    }
    return 'in_stock';
  }
}
