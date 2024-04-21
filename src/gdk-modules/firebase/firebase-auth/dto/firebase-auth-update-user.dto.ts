import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IFirebaseAuthUpdateUser } from '@shared/types/gdk/firebase-auth.types';

export class FirebaseAuthUpdateUserDto implements IFirebaseAuthUpdateUser {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ValidateIf((v) => v === '')
  @IsOptional()
  @IsUrl()
  photoURL?: string;

  @IsOptional()
  @IsBoolean()
  disabled?: boolean;
}
