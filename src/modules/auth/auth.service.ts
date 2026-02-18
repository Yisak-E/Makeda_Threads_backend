import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from '../users/schemas/users.schema';
import { CreateUserDto } from '../users/dto/create-users.dto';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto) {
    const { email, name, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create new user with customer role by default
    const newUser = new this.userModel({
      email,
      name,
      password: hashedPassword,
      role: UserRole.CUSTOMER,
      isActive: true,
    });

    await newUser.save();

    // Return user without password
    return this.sanitizeUser(newUser);
  }

  /**
   * Login user and return JWT token
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Validate password
    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.signToken(user._id.toString(), user.email, user.role);

    // Return token and user data
    return {
      access_token: token,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Validate user by email (used by strategies)
   */
  async validateUser(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email, isActive: true });
  }

  /**
   * Sign JWT token
   */
  signToken(userId: string, email: string, role: UserRole): string {
    const payload = {
      sub: userId,
      email,
      role,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Hash password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Validate password against hash
   */
  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Remove sensitive data from user object
   */
  private sanitizeUser(user: UserDocument | any) {
    const userObject = user.toObject ? user.toObject() : user;
    const { password, ...sanitized } = userObject;
    
    return {
      id: sanitized._id?.toString() || sanitized.id,
      email: sanitized.email,
      name: sanitized.name,
      role: sanitized.role,
      phone: sanitized.phone,
      address: sanitized.address,
      city: sanitized.city,
      postalCode: sanitized.postalCode,
      country: sanitized.country,
      isActive: sanitized.isActive,
      createdAt: sanitized.createdAt,
      updatedAt: sanitized.updatedAt,
    };
  }

  /**
   * Create user (admin function)
   */
  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create new user
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    await newUser.save();

    return this.sanitizeUser(newUser);
  }
}
