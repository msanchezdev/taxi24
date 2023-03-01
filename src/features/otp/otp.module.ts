import { Module, Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../accounts/users/users.module';
import { UsersService } from '../accounts/users/users.service';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { otpResolvers } from './resolvers';

@Module({
  imports: [UsersModule],
  providers: [OtpService, UsersService, JwtService, ...otpResolvers],
  controllers: [OtpController],
})
export class OtpModule {}
