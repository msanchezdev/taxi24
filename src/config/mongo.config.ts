import { get } from 'env-var';
import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const MongoConfig = registerAs(
  'mongo',
  (): MongooseModuleOptions => ({
    uri: get('MONGO_URI').required().asString(),
    dbName: get('MONGO_DATABASE').required().asString(),
  }),
);
