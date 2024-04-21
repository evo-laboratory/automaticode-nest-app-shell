import { Injectable } from '@nestjs/common';
import {
  DecodedIdToken,
  DeleteUsersResult,
  ListUsersResult,
  UpdateRequest,
  UserRecord,
} from 'firebase-admin/auth';
import {
  UserCredential,
  signInWithCustomToken,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseAuth } from '@vendors/firebase/firebase-app';
import { FirebaseAdminAuth } from '@vendors/firebase/firebase-admin-app';
import { MethodLogger } from '@shared/loggers/method-logger.decorator';
import { UniteHttpException } from '@shared/exceptions/united-http-exception';
import {
  ERROR_CODE,
  ERROR_SOURCE,
  FIREBASE_AUTH_ERR_CODE,
  IFirebaseAuthCreateCustomPayload,
  IFirebaseAuthCreateUser,
  IFirebaseAuthCustomTokenRes,
} from '@shared/types/gdk';

@Injectable()
export class FirebaseAuthService {
  // * We consider Firebase Auth as Auth Provider, so naming is Auth, not Firebase's User.
  private FirebaseAdminAuth = FirebaseAdminAuth;
  private FirebaseAppAuth = FirebaseAuth;

  @MethodLogger()
  public async createAuth(dto: IFirebaseAuthCreateUser): Promise<UserRecord> {
    try {
      const auth: IFirebaseAuthCreateUser = {
        email: dto.email,
        password: dto.password,
        displayName: dto.displayName,
        emailVerified: dto.emailVerified || false,
        disabled: false,
        photoURL: dto.photoURL,
      };
      if (!dto.photoURL) {
        delete auth.photoURL;
      }
      const newAuth: UserRecord = await this.FirebaseAdminAuth.createUser(auth);
      return newAuth;
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  // * --- End of Create

  @MethodLogger()
  public async getAuthByUid(uid: string): Promise<UserRecord> {
    try {
      const auth: UserRecord = await this.FirebaseAdminAuth.getUser(uid);
      return auth;
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  @MethodLogger()
  public async getAuthByEmail(email: string): Promise<UserRecord> {
    try {
      const auth: UserRecord = await this.FirebaseAdminAuth.getUserByEmail(
        email,
      );
      return auth;
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  @MethodLogger()
  public async getAuthByPhone(phoneNumber: string): Promise<UserRecord> {
    try {
      const auth: UserRecord =
        await this.FirebaseAdminAuth.getUserByPhoneNumber(phoneNumber);
      return auth;
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  @MethodLogger()
  public async listAuths(
    count = 1000,
    nextPageToken?: string,
  ): Promise<ListUsersResult> {
    try {
      const authList: ListUsersResult = await this.FirebaseAdminAuth.listUsers(
        count,
        nextPageToken,
      );
      return authList;
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  // * --- End of Read

  @MethodLogger()
  public async updateAuth(
    uid: string,
    dto: UpdateRequest,
  ): Promise<UserRecord> {
    const updateDto = dto;
    if (dto.photoURL === '') {
      delete updateDto.photoURL;
    }
    try {
      const auth: UserRecord = await this.FirebaseAdminAuth.updateUser(uid, {
        ...updateDto,
      });
      return auth;
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  @MethodLogger()
  public async enableAuth(uid: string): Promise<UserRecord> {
    try {
      const auth: UserRecord = await this.updateAuth(uid, { disabled: false });
      return auth;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @MethodLogger()
  public async disableAuth(uid: string): Promise<UserRecord> {
    try {
      const auth: UserRecord = await this.updateAuth(uid, { disabled: true });
      return auth;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @MethodLogger()
  public async setAuthEmailVerified(uid: string): Promise<UserRecord> {
    try {
      const auth: UserRecord = await this.updateAuth(uid, {
        emailVerified: true,
      });
      return auth;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @MethodLogger()
  public async updateUserPassword(
    uid: string,
    password: string,
  ): Promise<UserRecord> {
    try {
      const auth: UserRecord = await this.updateAuth(uid, {
        password: password,
      });
      return auth;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // * --- End of Update

  @MethodLogger()
  public async deleteAuth(uid: string): Promise<void> {
    try {
      // * Return undefined;
      const auth = await this.FirebaseAdminAuth.deleteUser(uid);
      return auth;
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  @MethodLogger()
  public async deleteAuths(uidList: string[]): Promise<DeleteUsersResult> {
    try {
      const deletedAuths = await this.FirebaseAdminAuth.deleteUsers(uidList);
      return deletedAuths;
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  // * --- End of Delete

  @MethodLogger()
  public async createCustomToken<T>(
    uid: string,
    tokenPayload?: IFirebaseAuthCreateCustomPayload<T>,
  ): Promise<IFirebaseAuthCustomTokenRes> {
    try {
      let payload = null;
      if (tokenPayload) {
        payload = { ...tokenPayload };
      }
      const token = await this.FirebaseAdminAuth.createCustomToken(
        uid,
        payload,
      );
      return {
        signInToken: token,
      };
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  @MethodLogger()
  public async createUserCustomToken(
    uid: string,
    tokenPayload?: IFirebaseAuthCreateCustomPayload<any>,
  ): Promise<IFirebaseAuthCustomTokenRes> {
    try {
      // * Step 1. Check User Token;
      const user = await this.FirebaseAdminAuth.getUser(uid);
      // * Step 2. Create CustomToken with User email, emailVerified, disabled, displayName, photoUrl
      const token = await this.FirebaseAdminAuth.createCustomToken(uid, {
        email: user.email,
        emailVerified: user.emailVerified,
        disabled: user.disabled,
        displayName: user.displayName,
        photoUrl: user.photoURL,
        ...tokenPayload,
      });
      return {
        signInToken: token,
      };
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  @MethodLogger()
  public async signInWithCustomToken(token: string): Promise<UserCredential> {
    try {
      const cred: UserCredential = await signInWithCustomToken(
        this.FirebaseAppAuth,
        token,
      );
      return cred;
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  @MethodLogger()
  public async signInWithEmailPassword(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    try {
      const cred: UserCredential = await signInWithEmailAndPassword(
        this.FirebaseAppAuth,
        email,
        password,
      );
      return cred;
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  @MethodLogger()
  public async verifyIdToken(token: string): Promise<DecodedIdToken> {
    try {
      const firebaseIdToken: DecodedIdToken =
        await this.FirebaseAdminAuth.verifyIdToken(token, true);
      return firebaseIdToken;
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  @MethodLogger()
  public async revokeRefreshTokenByUid(uid: string): Promise<void> {
    try {
      const revoked = await FirebaseAdminAuth.revokeRefreshTokens(uid);
      return revoked;
    } catch (error) {
      return Promise.reject(this.firebaseAuthErrorHandler(error));
    }
  }

  // * --- End of Token and Cred

  private firebaseAuthErrorHandler(error: any): any {
    if (error.code === FIREBASE_AUTH_ERR_CODE.NOT_FOUND) {
      throw new UniteHttpException({
        source: ERROR_SOURCE.FIREBASE_AUTH,
        errorCode: ERROR_CODE.AUTH_NOT_FOUND,
        statusCode: 404,
        message: error.message,
        errorMeta: error,
        disableAutoLog: true,
      });
    }
    if (error.code === FIREBASE_AUTH_ERR_CODE.INVALID_PHONE_NUMBER) {
      throw new UniteHttpException({
        source: ERROR_SOURCE.FIREBASE_AUTH,
        errorCode: ERROR_CODE.AUTH_INVALID_MOBILE_PHONE,
        statusCode: 400,
        message: error.message,
        errorMeta: error,
        disableAutoLog: true,
      });
    }
    if (error.code === FIREBASE_AUTH_ERR_CODE.EMAIL_EXIST) {
      throw new UniteHttpException({
        source: ERROR_SOURCE.FIREBASE_AUTH,
        errorCode: ERROR_CODE.AUTH_EMAIL_EXIST,
        statusCode: 400,
        message: error.message,
        errorMeta: error,
        disableAutoLog: true,
      });
    }
    if (error.code === FIREBASE_AUTH_ERR_CODE.INVALID_API_KEY) {
      throw new UniteHttpException({
        source: ERROR_SOURCE.FIREBASE_AUTH,
        errorCode: ERROR_CODE.FIREBASE_API_KEY_NOT_VALID,
        statusCode: 500,
        message: error.message,
        errorMeta: error,
        disableAutoLog: true,
      });
    }
    if (error.code === FIREBASE_AUTH_ERR_CODE.INVALID_PHOTO_URL) {
      throw new UniteHttpException({
        source: ERROR_SOURCE.FIREBASE_AUTH,
        errorCode: ERROR_CODE.AUTH_PHOTO_URL_INVALID,
        statusCode: 400,
        message: error.message,
        errorMeta: error,
        disableAutoLog: true,
      });
    }
    if (error.code === FIREBASE_AUTH_ERR_CODE.INVALID_CUSTOM_TOKEN) {
      throw new UniteHttpException({
        source: ERROR_SOURCE.FIREBASE_AUTH,
        errorCode: ERROR_CODE.AUTH_TOKEN_INVALID,
        statusCode: 401,
        message: error.message,
        errorMeta: error,
        disableAutoLog: true,
      });
    }
    if (error.code === FIREBASE_AUTH_ERR_CODE.ID_TOKEN_EXPIRED) {
      throw new UniteHttpException({
        source: ERROR_SOURCE.FIREBASE_AUTH,
        errorCode: ERROR_CODE.ID_TOKEN_EXPIRED,
        statusCode: 401,
        message: error.message,
        errorMeta: error,
        disableAutoLog: true,
      });
    }
    if (error.code === FIREBASE_AUTH_ERR_CODE.ID_TOKEN_REVOKED) {
      throw new UniteHttpException({
        source: ERROR_SOURCE.FIREBASE_AUTH,
        errorCode: ERROR_CODE.ID_TOKEN_REVOKED,
        statusCode: 401,
        message: error.message,
        errorMeta: error,
        disableAutoLog: true,
      });
    }
    if (error.code === FIREBASE_AUTH_ERR_CODE.ARGUMENT_ERROR) {
      throw new UniteHttpException({
        source: ERROR_SOURCE.FIREBASE_AUTH,
        errorCode: ERROR_CODE.ID_TOKEN_INVALID,
        statusCode: 401,
        message: error.message,
        errorMeta: error,
        disableAutoLog: true,
      });
    }
    throw new UniteHttpException({
      source: ERROR_SOURCE.FIREBASE_AUTH,
      errorCode: ERROR_CODE.UNKNOWN,
      statusCode: 500,
      message: error.message,
      errorMeta: error,
      disableAutoLog: true,
    });
  }

  // * --- End of Error handler
}
