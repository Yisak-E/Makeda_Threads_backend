import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { ProductCategory } from './schemas/products.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/users.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('category') category?: string) {
    if (category && !this.isValidCategory(category)) {
      throw new BadRequestException('Invalid category');
    }

    return this.productsService.findAll(category as ProductCategory | undefined);
  }

  @Get('search')
  async search(
    @Query('query') query?: string,
    @Query('category') category?: string,
  ) {
    if (category && !this.isValidCategory(category)) {
      throw new BadRequestException('Invalid category');
    }

    return this.productsService.search(
      query,
      category as ProductCategory | undefined,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BRAND_PARTNER)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BRAND_PARTNER)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { message: 'Product removed' };
  }

  private isValidCategory(category: string): boolean {
    return Object.values(ProductCategory).includes(category as ProductCategory);
  }
}
