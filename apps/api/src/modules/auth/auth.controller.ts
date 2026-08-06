import { Controller, Post, Body, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return {
      message: 'Login successful',
      user: { email: body.email, role: 'CUSTOMER' }
    };
  }

  @Post('register')
  async register(@Body() body: any) {
    return {
      message: 'Registration successful',
      user: { email: body.email }
    };
  }

  @Get('health')
  async health() {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
  }
}