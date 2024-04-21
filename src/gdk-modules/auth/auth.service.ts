import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRecord } from 'firebase-admin/auth';
import { FirebaseAuthService } from '@gdk/firebase/firebase-auth/firebase-auth.service';
import { MethodLogger } from '@shared/loggers/method-logger.decorator';
import {
  AUTH_CODE_USAGE,
  AUTH_PROVIDER,
  IAuthEmailSignedUpResultEvent,
  IAuthEmailSignInDto,
  IAuthEmailSignUpDto,
  IAuthEmailSignUpRes,
  IAuthEmailVerificationDto,
  IAuthEmailVerificationRes,
  IAuthRequireUserDataResultEvent,
  IAuthSignInRes,
  IAuthVerifyDto,
  IAuthVerifyResult,
} from '@shared/types/gdk/auth.type';
import {
  ALLOW_AUTH_VERIFICATION_USAGE,
  ALLOW_EMAIL_VERIFICATION_USAGE,
  AUTH_DELETE_EVENT,
  AUTH_DELETE_USER_RESULT_EVENT,
  AUTH_EMAIL_SIGNED_UP_EVENT,
  AUTH_EMAIL_SIGNED_UP_RESULT_EVENT,
  AUTH_EMAIL_VERIFICATION_EVENT,
  AUTH_EMAIL_VERIFICATION_RESULT_EVENT,
  AUTH_REQUIRE_USER_DATA_EVENT,
  AUTH_SIGNED_IN_EVENT,
  AUTH_USER_DATA_RESULT_EVENT,
  AUTH_VERIFY_AUTH_EVENT,
  AUTH_VERIFY_RESULT_EVENT,
  ERROR_CODE,
  ERROR_SOURCE,
  IFirebaseUserCredJSON,
  IUnitedHttpException,
} from '@shared/types/gdk';
import { AuthEmailSignedUpEvent } from '@gdk/auth/events/auth-email-signed-up.event';
import { MatchPropertiesFromObj } from '@shared/helper/helper';
import { EventService } from '@shared/services/event/event.service';
import { UniteHttpException } from '@shared/exceptions/united-http-exception';
import * as AutomaticodeJSON from '../../../automaticode.json';

import { AuthVerifyEvent } from './events/auth-verify.event';
import { AuthRequireUserDataEvent } from './events/auth-require-user-data.event';
import { AuthDeleteEvent } from './events/auth-delete.event';
import { AuthEmailVerificationEvent } from './events/auth-email-verification.event';
import { AuthSignedInEvent } from './events/auth-email-signed-in.event';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseAuth: FirebaseAuthService,
    private readonly event: EventService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @MethodLogger()
  public async emailSignUpV1(
    dto: IAuthEmailSignUpDto,
  ): Promise<IAuthEmailSignUpRes> {
    try {
      let displayName = dto.displayName;
      if (!displayName) {
        displayName = `${dto.firstName}_${dto.lastName}`;
      }
      const newAuth = await this.firebaseAuth.createAuth({
        email: dto.email,
        password: dto.password,
        displayName: displayName,
        emailVerified: false,
        photoURL: '',
      });
      const res: IAuthEmailSignUpRes = {
        provider: AUTH_PROVIDER.FIREBASE,
        uid: newAuth.uid,
        email: newAuth.email,
        displayName: displayName,
        isEmailVerified: newAuth.emailVerified,
      };
      const emittedBack =
        await this.event.promisedListener<IAuthEmailSignedUpResultEvent>(
          AUTH_EMAIL_SIGNED_UP_EVENT,
          AUTH_EMAIL_SIGNED_UP_RESULT_EVENT,
          new AuthEmailSignedUpEvent(
            res.provider,
            newAuth.uid,
            res.email,
            res.displayName,
            res.isEmailVerified,
            {
              firstName: dto.firstName,
              lastName: dto.lastName,
            },
          ),
        );
      if (emittedBack.isError || emittedBack.isTimeout) {
        this.throwError(
          ERROR_CODE.EVENTEMITTER_NO_RESPONSE,
          `${AUTH_EMAIL_SIGNED_UP_RESULT_EVENT} not respond`,
          500,
          `emailSignUpV1`,
        );
      }
      return res;
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  @MethodLogger()
  public async verifyAuthV1(dto: IAuthVerifyDto): Promise<IAuthVerifyResult> {
    try {
      // * STEP 1. Validate usage
      if (!ALLOW_AUTH_VERIFICATION_USAGE.includes(dto.usage)) {
        this.throwError(
          ERROR_CODE.AUTH_VERIFICATION_USAGE_NOT_ALLOW,
          'Usage not allow for using auth verification',
          400,
        );
      }
      // * STEP 2. Listen Back from User module
      const emittedBack = await this.event.promisedListener<IAuthVerifyResult>(
        AUTH_VERIFY_AUTH_EVENT,
        AUTH_VERIFY_RESULT_EVENT,
        new AuthVerifyEvent(
          dto.uid,
          dto.email,
          dto.code,
          dto.usage,
          dto.newPassword,
          {},
        ),
      );
      if (emittedBack.isError || emittedBack.isTimeout) {
        this.throwError(
          ERROR_CODE.EVENTEMITTER_NO_RESPONSE,
          `${AUTH_VERIFY_RESULT_EVENT} not respond`,
          500,
          `verifyAuthV1`,
        );
      }
      if (
        emittedBack.payload.isVerified &&
        emittedBack.payload.usage === AUTH_CODE_USAGE.FORGOT_PASSWORD
      ) {
        await this.firebaseAuth.updateUserPassword(
          emittedBack.payload.uid,
          dto.newPassword,
        );
      } else if (
        emittedBack.payload.isVerified &&
        emittedBack.payload.usage === AUTH_CODE_USAGE.SIGN_UP_VERIFY
      ) {
        await this.firebaseAuth.setAuthEmailVerified(dto.uid);
      }
      return emittedBack.payload;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @MethodLogger()
  async emailVerificationV1(
    dto: IAuthEmailVerificationDto,
  ): Promise<IAuthEmailVerificationRes> {
    try {
      // * STEP 1. Validate usage
      if (!ALLOW_EMAIL_VERIFICATION_USAGE.includes(dto.usage)) {
        this.throwError(
          ERROR_CODE.AUTH_EMAIL_VERIFICATION_USAGE_NOT_ALLOW,
          'Usage not allow for using email verification',
          400,
        );
      }
      const auth: UserRecord = await this.firebaseAuth.getAuthByEmail(
        dto.email,
      );
      // * STEP 2. Handle base on Usage
      if (dto.usage === AUTH_CODE_USAGE.SIGN_UP_VERIFY) {
        // * STEP 2-1. Check Email Not Verified or not
        if (auth.emailVerified) {
          this.throwError(
            ERROR_CODE.AUTH_EMAIL_ALREADY_VERIFIED,
            'Email already verified',
            400,
            `emailVerificationV1`,
          );
        }
      } else if (dto.usage === AUTH_CODE_USAGE.FORGOT_PASSWORD) {
        // * STEP 2-2. Check Email Verified or not
        if (!auth.emailVerified) {
          this.throwError(
            ERROR_CODE.AUTH_EMAIL_REQUIRE_VERIFIED,
            'Email is required to verified',
            400,
            `emailVerificationV1`,
          );
        }
      }
      // * STEP 2-3. Trigger AuthEmailVerificationEvent
      const emittedBack =
        await this.event.promisedListener<IAuthEmailVerificationRes>(
          AUTH_EMAIL_VERIFICATION_EVENT,
          AUTH_EMAIL_VERIFICATION_RESULT_EVENT,
          new AuthEmailVerificationEvent(dto.email, dto.usage, auth.uid),
        );
      if (emittedBack.isError || emittedBack.isTimeout) {
        this.throwError(
          ERROR_CODE.EVENTEMITTER_NO_RESPONSE,
          `${AUTH_EMAIL_VERIFICATION_RESULT_EVENT} not respond`,
          500,
          `emailVerificationV1`,
        );
      }
      return emittedBack.payload;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @MethodLogger()
  public async signInWithEmailPasswordV1(
    dto: IAuthEmailSignInDto,
  ): Promise<IAuthSignInRes> {
    try {
      let resultCred = null;
      // * Step 1. Check if Email Verified
      const auth = await this.firebaseAuth.getAuthByEmail(dto.email);
      if (!auth.emailVerified) {
        this.throwError(
          ERROR_CODE.AUTH_EMAIL_REQUIRE_VERIFIED,
          'Requires to verify email before sign-in',
          401,
        );
      }
      // * Step 2. Sign In With Auth
      resultCred = await this.firebaseAuth.signInWithEmailPassword(
        dto.email,
        dto.password,
      );
      // * Step 3. Determine if requires extra payload
      if (
        AutomaticodeJSON.Auth.JWT.CustomTokenUserPayloadProperties.length > 0
      ) {
        // * Step 3.1 Use CustomToken
        const emittedBack =
          await this.event.promisedListener<IAuthRequireUserDataResultEvent>(
            AUTH_REQUIRE_USER_DATA_EVENT,
            AUTH_USER_DATA_RESULT_EVENT,
            new AuthRequireUserDataEvent(auth.uid, auth.email),
            2,
          );
        if (emittedBack.isError || emittedBack.isTimeout) {
          this.throwError(
            ERROR_CODE.EVENTEMITTER_NO_RESPONSE,
            `${AUTH_REQUIRE_USER_DATA_EVENT} not respond`,
            500,
            `signInWithEmailPasswordV1`,
          );
        }
        if (emittedBack.payload.data === null) {
          this.throwError(
            ERROR_CODE.USER_NOT_FOUND,
            `${AUTH_REQUIRE_USER_DATA_EVENT} got null`,
            500,
            `signInWithEmailPasswordV1`,
          );
        }
        const payload = MatchPropertiesFromObj(
          emittedBack.payload.data,
          AutomaticodeJSON.Auth.JWT.CustomTokenUserPayloadProperties,
        );
        const customToken = await this.firebaseAuth.createCustomToken<any>(
          auth.uid,
          {
            signPayload: payload,
          },
        );
        resultCred = await this.firebaseAuth.signInWithCustomToken(
          customToken.signInToken,
        );
      }
      // * Step 3.2 Use Default JWT
      const credJSON: IFirebaseUserCredJSON =
        resultCred.user.toJSON() as IFirebaseUserCredJSON;
      const idToken = await resultCred.user.getIdToken();
      const res: IAuthSignInRes = {
        uid: resultCred.user.uid,
        email: resultCred.user.email,
        refreshToken: credJSON.stsTokenManager.refreshToken,
        accessToken: credJSON.stsTokenManager.accessToken,
        idToken: idToken,
        expiredAt: credJSON.stsTokenManager.expirationTime,
        expiresIn: 3600,
      };
      this.eventEmitter.emit(
        AUTH_SIGNED_IN_EVENT,
        new AuthSignedInEvent(
          res.uid,
          res.email,
          res.refreshToken,
          res.accessToken,
          res.idToken,
          res.expiredAt,
          res.expiresIn,
        ),
      );
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @MethodLogger()
  public async deleteAuth(uid: string): Promise<object> {
    try {
      await this.firebaseAuth.deleteAuth(uid);
      const emittedBack =
        await this.event.promisedListener<IAuthRequireUserDataResultEvent>(
          AUTH_DELETE_EVENT,
          AUTH_DELETE_USER_RESULT_EVENT,
          new AuthDeleteEvent(uid),
          2,
        );
      if (emittedBack.isError || emittedBack.isTimeout) {
        this.throwError(
          ERROR_CODE.EVENTEMITTER_NO_RESPONSE,
          `${AUTH_DELETE_USER_RESULT_EVENT} not respond`,
          500,
          `deleteAuth`,
        );
      }
      return emittedBack.payload;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @MethodLogger()
  public async signOutV1(uid: string) {
    try {
      await this.firebaseAuth.revokeRefreshTokenByUid(uid);
      const result = {
        uid: uid,
        isSignOut: true,
      };
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private throwError(
    code: ERROR_CODE,
    msg: string,
    statusCode?: number,
    methodName?: string,
  ): void {
    const errorObj: IUnitedHttpException = {
      source: ERROR_SOURCE.NESTJS,
      errorCode: code || ERROR_CODE.UNKNOWN,
      statusCode: statusCode || 500,
      message: msg,
      errorMeta: {},
      contextName: 'AuthService',
      methodName: `${methodName}`,
    };
    throw new UniteHttpException(errorObj);
  }
}
