import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  User,
  UserStatus,
} from '~/features/accounts/users/schemas/user.schema';
import {
  UserDisabledException,
  UserNotFoundException,
  UserNotYetActivatedException,
} from '~/features/accounts/users/users.exceptions';
import { UsersService } from '../accounts/users/users.service';
import { compare } from 'bcrypt';
import { InvalidCredentialsException } from './auth.exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);

    if (!user) {
      throw new UserNotFoundException(email);
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UserNotYetActivatedException(email);
    } else if (user.status === UserStatus.DISABLED) {
      throw new UserDisabledException(email);
    }

    if (!(await compare(password, user.password!))) {
      throw new InvalidCredentialsException();
    }

    return user;
  }

  async generateTokens(user: User) {
    const payload = {
      email: user.email,
      name: user.name,
      permissions: user.permissions,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        subject: user.email,
        expiresIn: '3h',
      }),
      refreshToken: this.jwtService.sign(payload, {
        subject: user.email,
      }),
    };
  }
}
