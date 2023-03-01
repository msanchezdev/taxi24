import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import { Config } from './config';
import { AppExceptionFilter } from './exceptions/app.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new AppExceptionFilter(
      app.get(ConfigService).get('NODE_ENV') !== 'production',
    ),
  );

  const config = app
    .get<ConfigService<Config>>(ConfigService)
    .get<Config['server']>('server');

  app.setGlobalPrefix(config?.basePath || '/');

  const logger = new Logger('bootstrap');
  if (config?.debugKey) {
    logger.debug(
      `Debug routes enabled, use header X-Debug-Key: ${config.debugKey}. They are all prefixed with "debug$".`,
    );
  }

  await app.listen(config?.port || 3000, config?.host || '0.0.0.0');
}

bootstrap();
