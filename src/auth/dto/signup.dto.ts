import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, maxLength: 64, example: 'StrongPassw0rd!' })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;
}
