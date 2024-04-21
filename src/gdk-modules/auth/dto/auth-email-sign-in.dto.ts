import { IsEmail, IsString, MinLength } from 'class-validator';
import { IAuthEmailSignInDto } from '@shared/types/gdk';
export class AuthEmailSignInDto implements IAuthEmailSignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
