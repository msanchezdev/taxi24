import { HttpStatus } from '@nestjs/common';
import { RegisterAppException } from '~/decorators/register-app-exception.decorator';
import { AppException } from '~/exceptions/app.exception';

@RegisterAppException('INVALID_OTP_CODE', HttpStatus.BAD_REQUEST)
export class InvalidOtpCodeException extends AppException {
  constructor(reason: string) {
    super('Invalid OTP code', 'Please check your OTP code and try again', {
      reason,
    });
  }
}

@RegisterAppException('OTP_CODE_EXPIRED', HttpStatus.BAD_REQUEST)
export class OtpCodeExpiredException extends AppException {
  constructor() {
    super(
      'OTP code expired',
      'This code has expired, please request a new OTP code',
    );
  }
}
