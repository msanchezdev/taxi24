import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Head,
  Options,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '~/config';

@Injectable()
export class DebugGuard implements CanActivate {
  constructor(private readonly configService: ConfigService<Config>) {}

  // only allow access if X-Debug-Key header is present and is valid
  canActivate(context: ExecutionContext): boolean {
    const secretDebugKey = this.configService.get('server', {
      infer: true,
    })?.debugKey;
    if (!secretDebugKey) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const debugKey = request.headers['x-debug-key'];

    return debugKey === secretDebugKey;
  }
}

export function UseDebugGuard(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options',
  route: string,
) {
  const decorator = {
    get: Get,
    post: Post,
    put: Put,
    patch: Patch,
    delete: Delete,
    head: Head,
    options: Options,
  }[method];

  return applyDecorators(UseGuards(DebugGuard), decorator(`debug@${route}`));
}
