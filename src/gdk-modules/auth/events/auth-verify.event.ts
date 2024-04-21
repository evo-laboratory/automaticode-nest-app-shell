import {
  AUTH_CODE_USAGE,
  IAuthVerifyDto,
  IAuthVerifyResult,
} from '@shared/types/gdk';

export class AuthVerifyEvent implements IAuthVerifyDto {
  constructor(
    public uid: string,
    public email: string,
    public code: string,
    public usage: AUTH_CODE_USAGE,
    public newPassword: string,
    public payload: any,
  ) {}
}

export class AuthVerifyResultEvent implements IAuthVerifyResult {
  constructor(
    public uid: string,
    public usage: AUTH_CODE_USAGE,
    public isVerified: boolean,
  ) {}
}
