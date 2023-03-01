import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { get } from 'env-var';

export const JwtConfig = registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: get('JWT_SECRET').required().asString(),
    signOptions: {
      expiresIn: get('JWT_EXPIRES_IN').required().asString(),
    },
  }),
);
