import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get notification logs for the current user' })
  @ApiQuery({ name: 'recipient', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Notification logs retrieved.' })
  async getLogs(
    @CurrentUser() user: CurrentUserData,
    @Query('recipient') recipient?: string,
  ) {
    return this.notificationsService.getLogsForUser(user, recipient);
  }
}
