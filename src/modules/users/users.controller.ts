import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/users.schema';

@ApiTags('users')
@Controller('users')
export class UsersController {
  /**
   * Example: Protected route - requires authentication
   * GET /api/v1/users/profile
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved.' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin dashboard' })
  @ApiResponse({ status: 200, description: 'Admin dashboard data.' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Partner dashboard' })
  @ApiResponse({ status: 200, description: 'Partner dashboard data.' })
  getPartnerDashboard(@CurrentUser() user: CurrentUserData) {
    return {
      message: 'Welcome to partner dashboard',
      user,
    };
  }
}
