import { HttpStatus } from '@nestjs/common';
import { paramCase } from 'change-case';
import { RegisterAppException } from '~/decorators/register-app-exception.decorator';
import { AppException } from '~/exceptions/app.exception';

@RegisterAppException('INVALID_ORGANIZATION_ID', HttpStatus.BAD_REQUEST)
export class InvalidOrganizationIdException extends AppException {
  constructor(organizationId: string) {
    super(
      'Invalid organization ID',
      'Organization ID must only contain lowercase letters, numbers, hyphens, and underscores and must start with a letter or number, not exceeding 60 characters.',
      {
        requested: organizationId,
        suggested: paramCase(organizationId),
      },
    );
  }
}

@RegisterAppException('NO_ORGANIZATION_SPECIFIED', HttpStatus.BAD_REQUEST)
export class NoOrganizationSpecifiedException extends AppException {
  constructor() {
    super('No organization specified', 'Please specify the organization id.');
  }
}

@RegisterAppException('ORGANIZATION_NOT_FOUND', HttpStatus.NOT_FOUND)
export class OrganizationNotFoundException extends AppException {
  constructor(organizationId: string) {
    super(
      'Organization not found',
      `Organization with id "${organizationId}" not found or is not active. Please contact your administrator.`,
      {
        requested: organizationId,
      },
    );
  }
}

@RegisterAppException('ORGANIZATION_ALREADY_EXISTS', HttpStatus.BAD_REQUEST)
export class OrganizationAlreadyExistsException extends AppException {
  constructor(organizationId: string) {
    super(
      'Organization already exists',
      `Organization with id "${organizationId}" already exists.`,
      {
        requested: organizationId,
      },
    );
  }
}
