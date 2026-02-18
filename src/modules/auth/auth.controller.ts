import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new customer' })
  @ApiResponse({ status: 201, description: 'Registration successful.' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    
    // Auto-login after registration
    const token = this.authService.signToken(user.id, user.email, user.role);
    
    return {
      message: 'Registration successful',
      access_token: token,
      user,
    };
  }

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Get current user profile (protected route)
   * GET /api/v1/auth/me
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved.' })
  async getProfile(@CurrentUser() user: CurrentUserData) {
    return this.authService.getProfile(user.userId);
  }
}
