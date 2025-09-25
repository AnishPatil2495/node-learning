import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../users/users.entity';
import { UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: Partial<User>) {
    // Implement the register method in AuthService
    return this.authService.register(userData);
  }

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginData.email, loginData.password);
    if (!user) {
      // Handle invalid credentials
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Get('profile')
  @UseGuards(RolesGuard)
  @Roles('Doctor', 'Patient')
  async getProfile(@Request() req) {
    return req.user;
  }
}