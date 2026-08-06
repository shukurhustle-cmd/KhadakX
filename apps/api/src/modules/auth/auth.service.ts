import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(body: { email: string; password: string }) {
    const token = this.jwtService.sign({ email: body.email });
    return {
      access_token: token,
      user: { email: body.email, role: 'CUSTOMER' }
    };
  }

  async register(body: any) {
    return {
      message: 'User registered successfully',
      user: { email: body.email }
    };
  }
}