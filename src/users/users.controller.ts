import { Controller, Get, UseGuards, Req } from '@nestjs/common';

import { Roles } from '../utils/roles.decorator';
import { RolesGuard } from '../utils/roles.guard';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from './users.schema';

@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getMe(@Req() req: { user: User }) {
    return req.user;
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  adminOnly() {
    return { ok: true };
  }
}
