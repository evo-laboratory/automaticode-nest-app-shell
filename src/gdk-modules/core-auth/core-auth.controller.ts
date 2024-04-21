import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RandomNumber } from '@shared/helper/helper';
import { CORE_AUTH_API, GPI } from '@shared/types/gdk';
@ApiTags(`${CORE_AUTH_API}`)
@Controller(`${GPI}/${CORE_AUTH_API}`)
export class CoreAuthController {
  // * Same from Firebase-auth
  @Get('test')
  async testV1() {
    return RandomNumber(6);
  }
  // TODO Post v1
  // TODO Post v1/custom-token
  // TODO Post v1/user-custom-token
  // TODO Post v1/custom-token/sign-in
  // TODO Get v1/list
  // TODO Get v1/email/:email
  // TODO Get v1/mobile/:phone
  // TODO Get v1/id-token-validation/:idToken
  // TODO Get v1/:uid
  // TODO Put v1/enable/:uid
  // TODO Put v1/disable/:uid
  // TODO Put v1/email-verified/:uid
  // TODO Put v1/:uid
  // TODO Delete v1/user-custom-token/sign-in/:uid
  // TODO Delete v1/
  // TODO Delete v1/:uid
}
