import { AUTH_CODE_USAGE } from '@shared/types/gdk/auth.type';

export const AUTH_API = 'auth';
export const AUTH_EMAIL_SIGNED_UP_EVENT = 'auth.email-signed-up';
export const AUTH_EMAIL_SIGNED_UP_RESULT_EVENT = 'auth.email-signed-up-result';
export const AUTH_EMAIL_VERIFIED_EVENT = 'auth.email-verified';
export const AUTH_SIGNED_IN_EVENT = 'auth.signed-in';
export const AUTH_VERIFY_AUTH_EVENT = 'auth.verify';
export const AUTH_VERIFY_RESULT_EVENT = 'auth.verify-result';
export const AUTH_EMAIL_VERIFICATION_EVENT = 'auth.email-verification';
export const AUTH_EMAIL_VERIFICATION_RESULT_EVENT =
  'auth.email-verification-result';
export const AUTH_REQUIRE_USER_DATA_EVENT = 'auth.require-user-data';
export const AUTH_USER_DATA_RESULT_EVENT = 'auth.user-data';
export const AUTH_DELETE_EVENT = 'auth.delete';
export const AUTH_DELETE_USER_RESULT_EVENT = 'auth.delete-user-result';

export const ALLOW_EMAIL_VERIFICATION_USAGE: AUTH_CODE_USAGE[] = [
  AUTH_CODE_USAGE.SIGN_UP_VERIFY,
  AUTH_CODE_USAGE.FORGOT_PASSWORD,
];
export const ALLOW_AUTH_VERIFICATION_USAGE: AUTH_CODE_USAGE[] = [
  AUTH_CODE_USAGE.SIGN_UP_VERIFY,
  AUTH_CODE_USAGE.FORGOT_PASSWORD,
];
