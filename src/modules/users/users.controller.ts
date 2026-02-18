import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/users.schema';

@Controller('users')
export class UsersController {
  /**
   * Example: Protected route - requires authentication
   * GET /api/v1/users/profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: CurrentUserData) {
    return {
      message: 'This is a protected route',
      user,
    };
  }

  /**
   * Example: Admin-only route
   * GET /api/v1/users/admin/dashboard
   */
  @Get('admin/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAdminDashboard(@CurrentUser() user: CurrentUserData) {
    return {
      message: 'Welcome to admin dashboard',
      user,
    };
  }

  /**
   * Example: Multiple roles allowed
   * GET /api/v1/users/partner/dashboard
   */
  @Get('partner/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BRAND_PARTNER)
  getPartnerDashboard(@CurrentUser() user: CurrentUserData) {
    return {
      message: 'Welcome to partner dashboard',
      user,
    };
  }
}
