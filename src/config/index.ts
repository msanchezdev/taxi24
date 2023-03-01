import { ServerConfig } from './server.config';
import { MongoConfig } from './mongo.config';
import { JwtConfig } from './jwt.config';

export type Config = {
  server: ReturnType<typeof ServerConfig>;
  mongo: ReturnType<typeof MongoConfig>;
  jwt: ReturnType<typeof JwtConfig>;
};

const LoadedConfigs = [MongoConfig, ServerConfig, JwtConfig];

export default LoadedConfigs;
