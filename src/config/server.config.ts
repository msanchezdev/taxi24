import { registerAs } from '@nestjs/config';
import { get } from 'env-var';

export const ServerConfig = registerAs('server', () => ({
  host: get('HOST').required().default('0.0.0.0').asString(),
  port: get('PORT').required().default(3000).asPortNumber(),
  basePath: get('BASE_PATH').required().default('/').asString(),
  debugKey: get('DEBUG_KEY').asString() || Math.random().toString(36).slice(2),
}));
