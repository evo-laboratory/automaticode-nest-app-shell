import { IAuthSignInRes } from '@shared/types/gdk';

export class AuthSignInRes implements IAuthSignInRes {
  uid: string;
  email: string;
  refreshToken: string;
  accessToken: string;
  idToken: string;
  expiredAt: number;
  expiresIn: number;
}
