import { Injectable } from '@nestjs/common';
import { User } from '~/features/accounts/users/schemas/user.schema';
import { UsersService } from '~/features/accounts/users/users.service';
import { OtpResolver } from './types';

@Injectable()
export class UserRegistrationResolver implements OtpResolver {
  static purpose = 'user-registration';

  constructor(private readonly usersService: UsersService) {}

  async resolve(user: User) {
    return this.usersService.activate(user.email);
  }
}
