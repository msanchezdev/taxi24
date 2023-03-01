import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ZodValidationException } from 'nestjs-zod';

type AppExceptionBody = {
  code: string;
  title: string;
  message: string;
  details?: any[] | Record<string, any>;
};

interface ErrorDefinition {
  title: string;
  message: string;
  status?: number;
  details?: any[] | Record<string, any>;
}

export class AppException extends HttpException {
  static code = 'APPLICATION_ERROR';
  static status = HttpStatus.INTERNAL_SERVER_ERROR;

  constructor(
    title: string,
    message: string,
    details?: any[] | Record<string, any>,
    status?: number,
  );
  constructor(error: ErrorDefinition);

  constructor(
    definition: string | ErrorDefinition,
    message?: string,
    details?: any[] | Record<string, any>,
    status?: number,
  ) {
    let error: AppExceptionBody = {
      code: 'APPLICATION_ERROR',
      title: typeof definition === 'string' ? definition : 'Application Error',
      message: message ?? 'An error occurred while processing your request.',
      details,
    };

    if (typeof definition === 'object') {
      error.title = definition.title;
      error.message = definition.message;
      error.details = definition.details;
      status = definition.status;
    }

    super(error, status ?? HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Catch(Error)
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly debug?: boolean) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: AppExceptionBody = {
      code: 'APPLICATION_ERROR',
      title: 'Application Error',
      message: this.debug
        ? exception.message
        : 'An error occurred while processing your request.',
    };

    if (exception instanceof AppException) {
      status =
        (exception.constructor as typeof AppException).status ??
        exception.getStatus();

      error = {
        ...(exception.getResponse() as AppExceptionBody),
        code: (exception.constructor as typeof AppException).code,
      };
    } else if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError();
      status = HttpStatus.BAD_REQUEST;
      error = {
        code: 'VALIDATION_ERROR',
        title: 'Validation Error',
        message: zodError.errors.map((e) => e.message).join(', '),
        details: zodError,
      };
    }

    response.status(status).json(error);
  }
}
