import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Config } from '~/config';
import { UsersModule } from '~/features/accounts/users/users.module';
import { JwtStrategy } from '~/guards/auth/jwt.strategy';
import { LocalStrategy } from '~/guards/auth/local.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService<Config>) =>
        config.get<Config['jwt']>('jwt')!,
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
