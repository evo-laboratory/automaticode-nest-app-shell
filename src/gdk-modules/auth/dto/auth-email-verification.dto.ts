import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AUTH_CODE_USAGE, IAuthEmailVerificationDto } from '@shared/types/gdk';
export class AuthEmailVerificationDto implements IAuthEmailVerificationDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(AUTH_CODE_USAGE, { each: true })
  usage: AUTH_CODE_USAGE;
}
