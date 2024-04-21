import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  AUTH_API,
  AUTH_VERIFICATION_PATH,
  EMAIL_SIGN_IN_PATH,
  EMAIL_SIGN_UP_PATH,
  EMAIL_VERIFICATION_PATH,
  GPI,
  IDecodedBaseIdToken,
  JWT_TOKEN_PATH,
  SIGN_OUT_PATH,
  VER_1,
} from '@shared/types/gdk';
import {
  AuthEmailSignUpDto,
  AuthEmailSignUpRes,
} from '@gdk/auth/dto/auth-email-sign-up.dto';
import { FirebaseJwtGuard } from '@shared/guards/firebase-jwt.guard';
import { VerifiedToken } from '@shared/decorators/verified-token.decorator';
import { AuthVerifyDto, AuthVerifyRes } from './dto/auth-verify.dto';
import { AuthEmailVerificationDto } from './dto/auth-email-verification.dto';
import { AuthEmailVerificationRes } from './events/auth-email-verification.event';
import { AuthEmailSignInDto } from './dto/auth-email-sign-in.dto';
import { AuthSignInRes } from './dto/auth-sign-in.dto';
import { AuthService } from './auth.service';

@ApiTags(`${AUTH_API}`)
@Controller(`${GPI}/${AUTH_API}`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(`${VER_1}/${EMAIL_SIGN_UP_PATH}`)
  @ApiCreatedResponse({
    type: AuthEmailSignUpRes,
  })
  async emailSignUpV1(@Body() dto: AuthEmailSignUpDto) {
    return await this.authService.emailSignUpV1(dto);
  }

  @Post(`${VER_1}/${EMAIL_VERIFICATION_PATH}`)
  @ApiCreatedResponse({
    type: AuthEmailVerificationRes,
  })
  async emailVerificationV1(@Body() dto: AuthEmailVerificationDto) {
    return await this.authService.emailVerificationV1(dto);
  }

  @Post(`${VER_1}/${AUTH_VERIFICATION_PATH}`)
  @ApiCreatedResponse({
    type: AuthVerifyRes,
  })
  async verifyAuthV1(@Body() dto: AuthVerifyDto) {
    return await this.authService.verifyAuthV1(dto);
  }

  @Post(`${VER_1}/${EMAIL_SIGN_IN_PATH}`)
  @ApiCreatedResponse({
    type: AuthSignInRes,
  })
  async emailSignInV1(@Body() dto: AuthEmailSignInDto) {
    return await this.authService.signInWithEmailPasswordV1(dto);
  }

  @UseGuards(FirebaseJwtGuard)
  @Post(`${VER_1}/${SIGN_OUT_PATH}`)
  async emailSignOutV1(@VerifiedToken() token: IDecodedBaseIdToken) {
    return await this.authService.signOutV1(token.uid);
  }

  @UseGuards(FirebaseJwtGuard)
  @Get(`${VER_1}/${JWT_TOKEN_PATH}`)
  async tokenStateV1(@VerifiedToken() token: IDecodedBaseIdToken) {
    return token;
  }

  @UseGuards(FirebaseJwtGuard)
  @Delete(`${VER_1}/:uid`)
  async deleteAuthV1(@Param('uid') uid: string) {
    return await this.authService.deleteAuth(uid);
  }
}
