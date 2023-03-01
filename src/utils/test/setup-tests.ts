import { INestApplication, ModuleMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGOOSE_CONNECTION_NAME } from '@nestjs/mongoose/dist/mongoose.constants';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { AppModule } from '~/app.module';
import { AppExceptionFilter } from '~/exceptions/app.exception';
import { seed, SeederConfig } from '../seed';

interface TestModuleMetadata<C extends new () => I, I> extends ModuleMetadata {
  seed?: SeederConfig<C, I>[];
}

export function setupTestApplication<C extends new () => I, I>(
  setup: (app: INestApplication) => Promise<void> | void,
  { seed: seedConfig, ...extras }: TestModuleMetadata<C, I> = {},
) {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      ...extras,
      imports: [AppModule, ...(extras?.imports || [])],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(
      new AppExceptionFilter(
        app.get(ConfigService).get('NODE_ENV') !== 'production',
      ),
    );
    await app.init();

    await setup(app);
  });

  beforeEach(async () => {
    const connectionName = app.get<string>(MONGOOSE_CONNECTION_NAME);
    const connection = app.get<Connection>(connectionName);

    const modelNames = Object.keys(connection.models);

    await Promise.all(
      modelNames.map((modelName) =>
        connection.models[modelName].deleteMany({}),
      ),
    );

    if (seedConfig) {
      await Promise.all(
        seedConfig.map(({ type, records }) => seed(app, type, records)),
      );
    }
  });

  afterEach(async () => {
    await app.close();
  });
}
