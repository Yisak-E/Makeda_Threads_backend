import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/users.schema';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-orders.dto';
import { RequestRefundDto, UpdateOrderStatusDto } from './dto/update-orders.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.ordersService.createOrder(createOrderDto, user);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@CurrentUser() user: CurrentUserData) {
    return this.ordersService.getMyOrders(user);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Patch(':id/request-refund')
  @UseGuards(JwtAuthGuard)
  async requestRefund(
    @Param('id') id: string,
    @Body() dto: RequestRefundDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return this.ordersService.requestRefund(id, user, dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
