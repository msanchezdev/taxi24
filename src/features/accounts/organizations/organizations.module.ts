import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationsController } from './organizations.controller';
import { Organization, TenantSchema } from './schemas/organization.schema';
import { OrganizationsService } from './organizations.service';
import { OtpModule } from '~/features/otp/otp.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Organization.name,
        schema: TenantSchema,
      },
    ]),
    OtpModule,
  ],
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
