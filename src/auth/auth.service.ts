import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as argon2 from 'argon2';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  private generateOtp(): { code: string; expiresAt: Date } {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    return { code, expiresAt };
  }

  private async signTokens(payload: {
    sub: string;
    email: string;
    roles: string[];
  }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret:
        this.configService.get('JWT_REFRESH_SECRET') ?? 'change-me-refresh',
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async signup(dto: SignupDto): Promise<void> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already in use');

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });
    const user = await this.usersService.createUser({
      email: dto.email,
      passwordHash,
    });

    const { code, expiresAt } = this.generateOtp();
    await this.usersService.setOtp(user.id, code, expiresAt);

    await this.mailService.sendOtpEmail({
      to: user.email,
      code,
      expiresAt,
    });
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.usersService.verifyAndConsumeOtp(
      dto.email,
      dto.code,
    );
    const tokens = await this.signTokens({
      sub: user.id,
      email: user.email,
      roles: user.roles,
    });
    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await argon2.verify(user.passwordHash, dto.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.signTokens({
      sub: user.id,
      email: user.email,
      roles: user.roles,
    });
    return tokens;
  }
}
