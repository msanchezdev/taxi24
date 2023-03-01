import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrganizationDocument = HydratedDocument<Organization>;

export const OrganizationStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type OrganizationStatus =
  (typeof OrganizationStatus)[keyof typeof OrganizationStatus];
export const OrganizationStatuses = Object.values(OrganizationStatus);

@Schema({ timestamps: true })
export class Organization {
  @Prop({ required: true, unique: true, index: true })
  id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop()
  logo?: string;

  @Prop({
    required: true,
    default: OrganizationStatus.INACTIVE,
    enum: OrganizationStatus,
  })
  status!: OrganizationStatus;
}

export const TenantSchema = SchemaFactory.createForClass(Organization);
