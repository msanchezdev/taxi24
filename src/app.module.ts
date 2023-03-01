import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ZodValidationPipe } from 'nestjs-zod';
import LoadedConfigs, { Config } from '~/config';
import { OrganizationsModule } from '~/features/accounts/organizations/organizations.module';
import { UsersModule } from '~/features/accounts/users/users.module';
import { OtpModule } from '~/features/otp/otp.module';
import { AuthModule } from '~/features/auth/auth.module';
import { Connection } from 'mongoose';
import * as mongooseHidden from 'mongoose-hidden';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: LoadedConfigs,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService<Config>) => ({
        ...config.get<Config['mongo']>('mongo')!,
        connectionFactory(connection: Connection, name) {
          connection.plugin(mongooseHidden());
          return connection;
        },
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    PassportModule,
    OrganizationsModule,
    UsersModule,
    OtpModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  controllers: [],
})
export class AppModule {}
