import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UseDebugGuard } from '~/guards/debug.guard';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('request')
  async requestOtp(@Body() request: RequestOtpDto) {
    return await this.otpService.requestOtp(request);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verification: VerifyOtpDto) {
    return await this.otpService.verifyOtp(verification);
  }

  @UseDebugGuard('get', 'get-otp-for-user/:user')
  async getOtpForUser(@Param('user') user: string) {
    return (await this.otpService.__getOtpForUser(user)) || null;
  }
}
