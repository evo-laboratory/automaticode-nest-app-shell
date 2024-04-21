import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import {
  AUTH_CODE_USAGE,
  IAuthVerifyDto,
  IAuthVerifyResult,
} from '@shared/types/gdk';
export class AuthVerifyDto implements IAuthVerifyDto {
  @IsString()
  @IsNotEmpty()
  uid: string;
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  usage: AUTH_CODE_USAGE;

  @IsString()
  @IsOptional()
  @MinLength(6)
  newPassword?: string;
}

export class AuthVerifyRes implements IAuthVerifyResult {
  uid: string;
  usage: AUTH_CODE_USAGE;
  isVerified: boolean;
}
