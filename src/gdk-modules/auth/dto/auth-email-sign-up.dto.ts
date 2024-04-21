import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import {
  IAuthEmailSignUpDto,
  IAuthEmailSignUpRes,
  AUTH_PROVIDER,
} from '@shared/types/gdk';

export class AuthEmailSignUpDto implements IAuthEmailSignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  displayName: string;
}

export class AuthEmailSignUpRes implements IAuthEmailSignUpRes {
  provider: AUTH_PROVIDER;
  uid: string;
  email: string;
  displayName: string;
  @ApiProperty({
    example: false,
  })
  isEmailVerified: boolean;
}
