import { IsNotEmpty, IsString } from 'class-validator';
import { IFirebaseAuthCustomTokenSignInReq } from '@shared/types/gdk/firebase-auth.types';

export class FirebaseAuthCustomTokenSignInDto
  implements IFirebaseAuthCustomTokenSignInReq
{
  @IsString()
  @IsNotEmpty()
  signInToken: string;
}
