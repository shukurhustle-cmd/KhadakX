import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body);
  }

  @Post('register')
  register(@Body() body: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    businessName: string;
    industry?: string;
    city?: string;
    state?: string;
    product?: 'MYAREA' | 'KHADAKX' | 'ADFORGE';
  }) {
    return this.auth.register(body);
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
