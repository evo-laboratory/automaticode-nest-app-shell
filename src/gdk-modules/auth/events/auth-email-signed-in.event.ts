import { IAuthSignInRes } from '@shared/types/gdk';
export class AuthSignedInEvent implements IAuthSignInRes {
  constructor(
    public uid: string,
    public email: string,
    public refreshToken: string,
    public accessToken: string,
    public idToken: string,
    public expiredAt: number,
    public expiresIn: number,
  ) {}
}
