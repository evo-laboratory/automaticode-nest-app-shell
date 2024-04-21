import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { IFirebaseAuthCustomToken } from '@shared/types/gdk/firebase-auth.types';

export class FirebaseAuthCreateCustomTokenDto
  implements IFirebaseAuthCustomToken<any>
{
  @IsString()
  @IsNotEmpty()
  uid: string;

  @IsObject()
  @IsNotEmpty()
  signPayload: any;
}
