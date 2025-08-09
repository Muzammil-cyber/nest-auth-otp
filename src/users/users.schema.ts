import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ type: [String], enum: UserRole, default: [UserRole.USER] })
  roles: UserRole[];

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ type: String, optional: true })
  otpCode?: string | null;

  @Prop({ type: Date, optional: true })
  otpExpiresAt?: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
