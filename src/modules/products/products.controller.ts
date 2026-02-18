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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { ProductCategory } from './schemas/products.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/users.schema';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get product catalog' })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Products retrieved.' })
  async findAll(@Query('category') category?: string) {
    if (category && !this.isValidCategory(category)) {
      throw new BadRequestException('Invalid category');
    }

    return this.productsService.findAll(category as ProductCategory | undefined);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products' })
  @ApiQuery({ name: 'query', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Products retrieved.' })
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
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Product retrieved.' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BRAND_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product (admin/brand-partner)' })
  @ApiResponse({ status: 201, description: 'Product created.' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BRAND_PARTNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (admin/brand-partner)' })
  @ApiResponse({ status: 200, description: 'Product updated.' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (admin)' })
  @ApiResponse({ status: 200, description: 'Product removed.' })
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { message: 'Product removed' };
  }

  private isValidCategory(category: string): boolean {
    return Object.values(ProductCategory).includes(category as ProductCategory);
  }
}
