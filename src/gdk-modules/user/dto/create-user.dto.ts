import { AUTH_PROVIDER } from '@shared/types/gdk/auth.type';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { ICreateUserDto } from '../user.type';
export class CreateUserDto implements ICreateUserDto {
  @IsString()
  authId: string;

  @IsString()
  @IsOptional()
  authProvider: AUTH_PROVIDER;

  @IsString()
  @IsOptional()
  authCode: string;

  @IsNumber()
  @IsOptional()
  authCodeExpiredAt: number;

  @IsString()
  @IsOptional()
  displayName: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  isEmailVerified: boolean;
}
