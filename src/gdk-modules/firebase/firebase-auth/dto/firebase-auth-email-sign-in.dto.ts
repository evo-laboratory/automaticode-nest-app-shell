import { IsEmail, IsString, MinLength } from 'class-validator';
import { IFirebaseAuthEmailSignInDto } from '@shared/types/gdk';
export class FirebaseAuthEmailSignInDto implements IFirebaseAuthEmailSignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
