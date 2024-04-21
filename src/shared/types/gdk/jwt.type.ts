// * If signed with custom claim, will included those properties, you can extend this base interface.
export interface IDecodedBaseIdToken {
  name: string;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: boolean;
  uid: string;
}
