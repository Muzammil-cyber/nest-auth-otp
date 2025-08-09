import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(params: {
    email: string;
    passwordHash: string;
    roles?: UserRole[];
  }): Promise<UserDocument> {
    const user = new this.userModel({
      email: params.email,
      passwordHash: params.passwordHash,
      roles: params.roles ?? [UserRole.USER],
    });
    return await user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async setOtp(
    userId: string,
    otpCode: string,
    otpExpiresAt: Date,
  ): Promise<void> {
    await this.userModel
      .updateOne({ _id: userId }, { $set: { otpCode, otpExpiresAt } })
      .exec();
  }

  async clearOtp(userId: string): Promise<void> {
    await this.userModel
      .updateOne(
        { _id: userId },
        { $set: { otpCode: null, otpExpiresAt: null } },
      )
      .exec();
  }

  async verifyAndConsumeOtp(
    email: string,
    code: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException('User not found');
    if (!user.otpCode || !user.otpExpiresAt)
      throw new NotFoundException('OTP not set');
    const now = new Date();
    if (user.otpCode !== code || user.otpExpiresAt.getTime() < now.getTime()) {
      throw new NotFoundException('Invalid or expired OTP');
    }
    user.otpCode = null;
    user.otpExpiresAt = null;
    user.isEmailVerified = true;
    await user.save();
    return user;
  }
}
