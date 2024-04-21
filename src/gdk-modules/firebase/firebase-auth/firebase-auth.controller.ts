import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CUSTOM_TOKEN_PATH,
  DISABLE_PATH,
  EMAIL_PATH,
  EMAIL_VERIFIED_PATH,
  ENABLE_PATH,
  FIREBASE_AUTH_API,
  GPI,
  ID_TOKEN_VALIDATION_PATH,
  LIST_PATH,
  MOBILE_PHONE_PATH,
  SIGN_IN_PATH,
  USER_CUSTOM_TOKEN_PATH,
  VER_1,
} from '@shared/types/gdk';
import { FirebaseAuthCreateCustomTokenDto } from './dto/firebase-auth-create-custom-token.dto';
import { FirebaseAuthCreateUserDto } from './dto/firebase-auth-create-user.dto';
import { FirebaseAuthDeleteUserListDto } from './dto/firebase-auth-delete-user-list.dto';
import { FirebaseAuthEmailSignInDto } from './dto/firebase-auth-email-sign-in.dto';
import { FirebaseAuthUpdateUserDto } from './dto/firebase-auth-update-user.dto';
import { FirebaseAuthCustomTokenSignInDto } from './dto/firebase-auth.custom-token-sign-in.dto';
import { FirebaseAuthService } from './firebase-auth.service';

@ApiTags(`${FIREBASE_AUTH_API}`)
@Controller(`${GPI}/${FIREBASE_AUTH_API}`)
export class FirebaseAuthController {
  // * Firebase Auth APIs normally shouldn't be expose to public, use Methods instead.
  // * These APIs are for managing Auth in dashboard, not for user to proceed AuthFlows
  // * Please use /gpi/auth for clients
  // * Required SuperAdmin Role.

  // TODO Add SuperAdmin Role.
  constructor(private readonly firebaseAuth: FirebaseAuthService) {}

  @Post(`${VER_1}`)
  @ApiBearerAuth()
  async createAuth(@Body() dto: FirebaseAuthCreateUserDto) {
    return await this.firebaseAuth.createAuth(dto);
  }

  @Post(`${VER_1}/${CUSTOM_TOKEN_PATH}`)
  @ApiBearerAuth()
  async createCustomToken(@Body() dto: FirebaseAuthCreateCustomTokenDto) {
    return await this.firebaseAuth.createCustomToken(dto.uid, dto.signPayload);
  }

  @Post(`${VER_1}/${USER_CUSTOM_TOKEN_PATH}`)
  @ApiBearerAuth()
  async createUserCustomToken(@Body() dto: FirebaseAuthCreateCustomTokenDto) {
    return await this.firebaseAuth.createUserCustomToken(
      dto.uid,
      dto.signPayload,
    );
  }

  @Post(`${VER_1}/${CUSTOM_TOKEN_PATH}/${SIGN_IN_PATH}`)
  @ApiBearerAuth()
  async signInCustomToken(@Body() dto: FirebaseAuthCustomTokenSignInDto) {
    return await this.firebaseAuth.signInWithCustomToken(dto.signInToken);
  }

  @Post(`${VER_1}/${EMAIL_PATH}/${SIGN_IN_PATH}`)
  @ApiBearerAuth()
  async signInWithEmailPassword(@Body() dto: FirebaseAuthEmailSignInDto) {
    return await this.firebaseAuth.signInWithEmailPassword(
      dto.email,
      dto.password,
    );
  }

  @Get(`${VER_1}/${LIST_PATH}`)
  @ApiBearerAuth()
  async getAllAuths() {
    return await this.firebaseAuth.listAuths();
  }

  @Get(`${VER_1}/${EMAIL_PATH}/:email`)
  @ApiBearerAuth()
  async getAuthByEmail(@Param('email') email: string) {
    return await this.firebaseAuth.getAuthByEmail(email);
  }

  @Get(`${VER_1}/${MOBILE_PHONE_PATH}/:phone`)
  @ApiBearerAuth()
  async getAuthByMobilePhone(@Param('phone') phone: string) {
    return await this.firebaseAuth.getAuthByPhone(phone);
  }

  @Get(`${VER_1}/${ID_TOKEN_VALIDATION_PATH}/:idToken`)
  @ApiBearerAuth()
  async validateIdToken(@Param('idToken') idToken: string) {
    return await this.firebaseAuth.verifyIdToken(idToken);
  }

  @Get(`${VER_1}/:id`)
  @ApiBearerAuth()
  async getByUid(@Param('id') uid: string) {
    return await this.firebaseAuth.getAuthByUid(uid);
  }

  @Put(`${VER_1}/${ENABLE_PATH}/:id`)
  @ApiBearerAuth()
  async enableAuthByUid(@Param('id') uid: string) {
    return await this.firebaseAuth.enableAuth(uid);
  }

  @Put(`${VER_1}/${DISABLE_PATH}/:id`)
  @ApiBearerAuth()
  async disableAuthByUid(@Param('id') uid: string) {
    return await this.firebaseAuth.disableAuth(uid);
  }

  @Put(`${VER_1}/${EMAIL_VERIFIED_PATH}/:id`)
  @ApiBearerAuth()
  async verifyAuthEmailByUid(@Param('id') uid: string) {
    return await this.firebaseAuth.setAuthEmailVerified(uid);
  }

  @Put(`${VER_1}/:id`)
  @ApiBearerAuth()
  async updateAuthByUid(
    @Param('id') uid: string,
    @Body() dto: FirebaseAuthUpdateUserDto,
  ) {
    return await this.firebaseAuth.updateAuth(uid, dto);
  }

  @Delete(`${VER_1}/${USER_CUSTOM_TOKEN_PATH}/${SIGN_IN_PATH}/:id`)
  @ApiBearerAuth()
  async logoutByUid(@Param('id') uid: string) {
    return await this.firebaseAuth.revokeRefreshTokenByUid(uid);
  }

  @Delete(`${VER_1}`)
  @ApiBearerAuth()
  async deleteAuths(@Query() dto: FirebaseAuthDeleteUserListDto) {
    const idListArr: string[] = dto.uidList.split(',');
    return await this.firebaseAuth.deleteAuths(idListArr);
  }

  @Delete(`${VER_1}/:id`)
  @ApiBearerAuth()
  async deleteAuthByUid(@Param('id') uid: string) {
    return await this.firebaseAuth.deleteAuth(uid);
  }
  // TODO OAuth Social login
}
