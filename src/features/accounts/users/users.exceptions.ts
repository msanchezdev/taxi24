import { HttpStatus } from '@nestjs/common';
import { RegisterAppException } from '~/decorators/register-app-exception.decorator';
import { AppException } from '~/exceptions/app.exception';

@RegisterAppException('USER_ALREADY_EXISTS', HttpStatus.BAD_REQUEST)
export class UserAlreadyExistsException extends AppException {
  constructor(email: string) {
    super(
      'User Already Exists',
      'A user with the specified email already exists.',
      {
        email,
      },
    );
  }
}

@RegisterAppException('USER_NOT_FOUND', HttpStatus.NOT_FOUND)
export class UserNotFoundException extends AppException {
  constructor(email: string) {
    super('User Not Found', 'A user with the specified email was not found.', {
      email,
    });
  }
}

@RegisterAppException('USER_NOT_YET_ACTIVATED', HttpStatus.FORBIDDEN)
export class UserNotYetActivatedException extends AppException {
  constructor(email: string) {
    super('User Not Yet Activated', 'This user has not yet been activated.', {
      email,
    });
  }
}

@RegisterAppException('USER_DISABLED', HttpStatus.FORBIDDEN)
export class UserDisabledException extends AppException {
  constructor(email: string) {
    super(
      'User Disabled',
      'This user has been disabled. Please contact support for more details.',
      {
        email,
      },
    );
  }
}
