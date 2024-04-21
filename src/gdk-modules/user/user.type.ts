import { AUTH_CODE_USAGE, AUTH_PROVIDER } from '@shared/types/gdk';
import { ROLE } from './role.static';

export type IUser = {
  authId: string;
  authProvider: AUTH_PROVIDER;
  authCode?: string;
  authCodeExpiredAt?: number;
  authCodeUsage?: AUTH_CODE_USAGE;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: ROLE[];
  isEmailVerified?: boolean;
  createdAt: number;
  updatedAt: number;
  lastSignInAt: number;
};

export type ICreateUserDto = Omit<
  IUser,
  'createdAt' | 'updatedAt' | 'lastSignInAt' | 'roles'
>;
export type IUserFullUpdateDto = ICreateUserDto;
export type IUpdateUserDto = Omit<
  ICreateUserDto,
  'authProvider' | 'authCodeUsage'
>;

export type IUpdateUserAuthDto = Pick<
  IUser,
  'authCode' | 'authCodeExpiredAt' | 'authCodeUsage' | 'isEmailVerified'
>;

export type IUpdateUserSignedInDto = Pick<IUser, 'lastSignInAt'>;
