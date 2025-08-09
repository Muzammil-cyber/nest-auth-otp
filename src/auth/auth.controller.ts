import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create account and send OTP to email' })
  @ApiCreatedResponse({ description: 'Signup successful, OTP sent to email' })
  async signup(@Body() dto: SignupDto) {
    await this.authService.signup(dto);
    return {
      message: 'Signup successful. Please verify OTP sent to your email.',
    };
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and issue tokens' })
  @ApiOkResponse({ description: 'OTP verified, JWTs returned' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const tokens = await this.authService.verifyOtp(dto);
    return tokens;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with password and issue tokens' })
  @ApiOkResponse({ description: 'Credentials valid, JWTs returned' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
