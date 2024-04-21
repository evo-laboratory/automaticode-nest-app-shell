import { UserDocument } from '@gdk/user/user.schema';
import { IUser } from '@gdk/user/user.type';
import {
  AUTH_PROVIDER,
  IAuthEmailSignUpRes,
  IAuthEmailSignedUpResultEvent,
} from '@shared/types/gdk';

export class AuthEmailSignedUpEvent implements IAuthEmailSignUpRes {
  constructor(
    public provider: AUTH_PROVIDER,
    public uid: string,
    public email: string,
    public displayName: string,
    public isEmailVerified: boolean,
    public payload: any,
  ) {}
}

export class AuthEmailSignedUpResultEvent
  implements IAuthEmailSignedUpResultEvent
{
  constructor(public data: IUser | UserDocument) {}
}
