export enum ERROR_SOURCE {
  FIREBASE_AUTH = 'FIREBASE_AUTH',
  NESTJS = 'NESTJS',
  MONGODB = 'MONGODB',
}

export enum ERROR_CODE {
  UNKNOWN = 'ERR_UNKNOWN',
  // * Common
  EXPERT_QUERY = 'EXPERT_QUERY',
  EVENTEMITTER_NO_RESPONSE = 'EVENTEMITTER_NO_RESPONSE',
  // * Auth
  AUTH_NOT_FOUND = 'AUTH_NOT_FOUND',
  AUTH_INVALID_MOBILE_PHONE = 'AUTH_INVALID_MOBILE_PHONE',
  AUTH_EMAIL_EXIST = 'AUTH_EMAIL_EXIST',
  AUTH_PHOTO_URL_INVALID = 'AUTH_PHOTO_URL_INVALID',
  AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
  AUTH_EMAIL_VERIFICATION_USAGE_NOT_ALLOW = 'AUTH_EMAIL_VERIFICATION_USAGE_NOT_ALLOW',
  AUTH_VERIFICATION_USAGE_NOT_ALLOW = 'AUTH_VERIFICATION_USAGE_NOT_ALLOW',
  AUTH_EMAIL_ALREADY_VERIFIED = 'AUTH_EMAIL_ALREADY_VERIFIED',
  AUTH_EMAIL_REQUIRE_VERIFIED = 'AUTH_EMAIL_REQUIRE_VERIFIED',
  FIREBASE_API_KEY_NOT_VALID = 'FIREBASE_API_KEY_NOT_VALID',
  ID_TOKEN_EXPIRED = 'ID_TOKEN_EXPIRED',
  ID_TOKEN_REVOKED = 'ID_TOKEN_REVOKED',
  ID_TOKEN_INVALID = 'ID_TOKEN_INVALID',
  // * User
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  // * MognoDB
  SCHEMA_VALIDATE_FAILED = 'SCHEMA_VALIDATE_FAILED',
}

export interface IUnitedHttpException {
  source?: ERROR_SOURCE;
  errorCode?: ERROR_CODE;
  message: string;
  statusCode?: number;
  errorMeta?: any;
  errorStack?: any;
  contextName?: string;
  methodName?: string;
  disableAutoLog?: boolean;
}

export const LISTENER_ERROR_EVENT = 'default.listener-error';