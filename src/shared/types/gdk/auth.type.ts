import { UserDocument } from '@gdk/user/user.schema';
import { IUser } from '@gdk/user/user.type';

export enum AUTH_PROVIDER {
  FIREBASE = 'FIREBASE',
  CORE_AUTH = 'CORE_AUTH',
}

export enum AUTH_CODE_USAGE {
  NOT_SET = 'NOT_SET',
  SIGN_UP_VERIFY = 'SIGN_UP_VERIFY',
  PHONE_VERIFY = 'PHONE_VERIFY',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export interface IAuthEmailSignUpDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName?: string; // * If not provide, will use firstName_lastName
}

export interface IAuthEmailSignUpRes {
  provider: AUTH_PROVIDER;
  uid: string;
  email: string;
  displayName: string;
  isEmailVerified: boolean;
}

export interface IAuthVerifyDto {
  uid: string;
  email: string;
  code: string;
  usage: AUTH_CODE_USAGE;
  newPassword?: string; // * Required when verify usage is PASSWORD related
}

export interface IAuthVerifyResult {
  uid: string;
  usage: AUTH_CODE_USAGE;
  isVerified: boolean;
}

export interface IAuthEmailVerificationDto {
  email: string;
  usage: AUTH_CODE_USAGE; // * Only allow SIGN_UP_VERIFY, FORGOT_PASSWORD
}

export interface IAuthEmailVerificationEvent extends IAuthEmailVerificationDto {
  uid: string;
}

export interface IAuthEmailVerificationRes {
  uid: string;
  isUpdated: boolean;
  isSentMail: boolean;
}

export interface IAuthEmailSignInDto {
  email: string;
  password: string;
}

export interface IAuthSignInRes {
  uid: string;
  email: string;
  refreshToken: string;
  accessToken: string;
  idToken: string;
  expiredAt: number;
  expiresIn: number;
}

export interface IAuthRequireUserDataEvent {
  uid: string;
  email: string;
}

export interface IAuthRequireUserDataResultEvent {
  data: IUser | null;
}

export interface IAuthEmailSignedUpResultEvent {
  data: IUser | UserDocument;
}
export interface IAuthDeleteEvent {
  uid: string;
}

export interface IAuthDeletedUserEvent {
  data: IUser | UserDocument;
}
