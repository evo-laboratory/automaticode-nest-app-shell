export interface IFirebaseAuthCreateUser {
  email: string;
  password: string;
  displayName: string;
  emailVerified?: boolean;
  photoURL?: string;
  disabled?: boolean; // * Default False
}

export type IFirebaseAuthUpdateUser = IFirebaseAuthCreateUser;
export interface IFirebaseAuthCustomToken<T> {
  uid: string;
  signPayload: T;
}

export type IFirebaseAuthCreateCustomPayload<T> = Omit<
  IFirebaseAuthCustomToken<T>,
  'uid'
>;

export interface IFirebaseAuthCustomTokenRes {
  signInToken: string;
}

export type IFirebaseAuthCustomTokenSignInReq = IFirebaseAuthCustomTokenRes;

export const FIREBASE_AUTH_ERR_CODE = {
  NOT_FOUND: 'auth/user-not-found',
  INVALID_PHONE_NUMBER: 'auth/invalid-phone-number',
  EMAIL_EXIST: 'auth/email-already-exists',
  INVALID_API_KEY: 'auth/api-key-not-valid.-please-pass-a-valid-api-key.',
  INVALID_PHOTO_URL: 'auth/invalid-photo-url',
  INVALID_CUSTOM_TOKEN: 'auth/invalid-custom-token',
  ID_TOKEN_EXPIRED: 'auth/id-token-expired',
  ID_TOKEN_REVOKED: 'auth/id-token-revoked',
  ARGUMENT_ERROR: 'auth/argument-error',
};

export interface IFirebaseAuthEmailSignInDto {
  email: string;
  password: string;
}

export interface IFirebaseProivderDataItem {
  providerId: string;
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: null;
  photoURL: null;
}

export interface IFirebaseUserCredJSON {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  isAnonymous: boolean;
  providerData: IFirebaseProivderDataItem[];
  stsTokenManager: {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
  };
  createdAt: string;
  lastLoginAt: string;
  apiKey: string;
  appName: string;
}
