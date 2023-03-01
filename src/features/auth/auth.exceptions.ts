import { HttpStatus } from '@nestjs/common';
import { RegisterAppException } from '~/decorators/register-app-exception.decorator';
import { AppException } from '~/exceptions/app.exception';

@RegisterAppException('INVALID_CREDENTIALS', HttpStatus.UNAUTHORIZED)
export class InvalidCredentialsException extends AppException {
  constructor() {
    super('Invalid Credentials', 'The provided credentials are invalid.');
  }
}
