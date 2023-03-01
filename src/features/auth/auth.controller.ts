import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '~/guards/auth/jwt.guard';
import { LocalAuthGuard } from '~/guards/auth/local.guard';
import { User } from '../accounts/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: User) {
    return this.authService.generateTokens(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }
}
