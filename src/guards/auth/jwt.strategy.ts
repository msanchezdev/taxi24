import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Config } from '~/config';
import { UsersService } from '~/features/accounts/users/users.service';
import { AuthService } from '~/features/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService<Config>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt', { infer: true })?.secret,
    } as StrategyOptions);
  }

  // TODO: change payload type
  async validate(payload: any) {
    const user = await this.usersService.getByEmail(payload.sub);

    return user;
  }
}
