import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '@shared/decorators/roles.decorator';
import { FirebaseJwtGuard } from '@shared/guards/firebase-jwt.guard';
import { RolesJwtGuard } from '@shared/guards/roles-jwt.guard';
import { GPI, VER_1 } from '@shared/types/gdk';

import { CreateUserDto } from './dto/create-user.dto';
import { ROLE } from './role.static';
import { UserService } from './user.service';

@Controller(`${GPI}/user`)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(`${VER_1}`)
  @ApiBearerAuth()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @UseGuards(FirebaseJwtGuard, RolesJwtGuard)
  @Roles([ROLE.SUPER, ROLE.ADMIN])
  @Get(`${VER_1}/test`)
  async testGuard() {
    return { message: 'volla' };
  }
}
