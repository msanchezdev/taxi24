import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import mongoose, { HydratedDocument } from 'mongoose';
import { Organization } from '~/features/accounts/organizations/schemas/organization.schema';

export type UserDocument = HydratedDocument<User>;

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISABLED: 'disabled',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export const UserStatuses = Object.values(UserStatus);

export interface OtpCode {
  purpose: string;
  code: string;
  expiresAt: Date;
}

@Schema()
export class User {
  @Prop()
  id!: string;

  @Prop({ required: true, hideJSON: true })
  password?: string;

  @Prop({ required: true, unique: true, index: true })
  email!: string;

  @Prop({
    type: raw({
      given: { type: String, required: true },
      family: { type: String, required: true },
    }),
    required: true,
  })
  name!: {
    given: string;
    family: string;
  };

  @Prop({
    required: true,
    default: UserStatus.INACTIVE,
    enum: UserStatus,
  })
  status!: UserStatus;

  @Prop({ required: true, default: [] })
  permissions!: string[];

  @Prop({
    type: raw({
      purpose: { type: String, required: true },
      code: { type: String, required: true },
      expiresAt: { type: Date, required: true },
    }),
    required: false,
    hideJSON: true,
  })
  otp?: OtpCode | null;

  @Prop({
    default: null,
    type: mongoose.Schema.Types.ObjectId,
    ref: Organization.name,
  })
  tenant!: Organization | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password!, 10);
  }

  next();
});
