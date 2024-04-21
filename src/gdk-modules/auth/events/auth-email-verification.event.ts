import {
  AUTH_CODE_USAGE,
  IAuthEmailVerificationEvent,
  IAuthEmailVerificationRes,
} from '@shared/types/gdk';

export class AuthEmailVerificationEvent implements IAuthEmailVerificationEvent {
  constructor(
    public email: string,
    public usage: AUTH_CODE_USAGE,
    public uid: string,
  ) {}
}

export class AuthEmailVerificationRes implements IAuthEmailVerificationRes {
  constructor(
    public uid: string,
    public isSentMail: boolean,
    public isUpdated: boolean,
  ) {}
}
