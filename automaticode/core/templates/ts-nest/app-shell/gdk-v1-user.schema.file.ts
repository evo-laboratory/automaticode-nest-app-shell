export function GDKV1UserSchemaFile() {
  return `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IUser } from '@gdk/user/user.type';
import { EnumToArray } from '@shared/helper/helper';
import { MongoModelBuilder } from '@shared/mongodb/mongodb-model-builder';
import { AUTH_CODE_USAGE, AUTH_PROVIDER } from '@shared/types/gdk';
import { USER_MODEL_NAME } from './user.static';
import { ROLE } from './role.static';

export type UserDocument = HydratedDocument<User>;

export class User implements IUser {
  @Prop({ required: true })
  authId: string;

  @Prop({
    type: String,
    enum: EnumToArray(AUTH_PROVIDER),
    default: AUTH_PROVIDER.CORE_AUTH,
  })
  authProvider: AUTH_PROVIDER;

  @Prop({ default: '' })
  authCode: string;

  @Prop({
    type: String,
    enum: EnumToArray(AUTH_CODE_USAGE),
    default: AUTH_CODE_USAGE.NOT_SET,
  })
  authCodeUsage: AUTH_CODE_USAGE;

  @Prop({ default: 0 })
  authCodeExpiredAt: number;

  @Prop({ default: '' })
  displayName: string;

  @Prop({ default: '' })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop([
    {
      type: String,
      enum: EnumToArray(ROLE),
      default: ROLE.GENERAL,
    },
  ])
  roles: ROLE[];

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: 0 })
  lastSignInAt: number;

  ${'TODO RESOLVE EXTRA SCHEMAS'}

  @Prop({ default: Date.now() })
  createdAt: number;

  @Prop({ default: Date.now() })
  updatedAt: number;
  
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ authId: 1 });
UserSchema.index({ email: 1 });
export const UserModel = MongoModelBuilder(USER_MODEL_NAME, UserSchema);
`;
}
