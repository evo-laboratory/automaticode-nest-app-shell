import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AuthSignedInEvent } from '@gdk/auth/events/auth-email-signed-in.event';
import { AuthRequireUserDataEvent } from '@gdk/auth/events/auth-require-user-data.event';
import { AuthRequireUserDataResultEvent } from '@gdk/auth/events/auth-require-user-data-result.event';
import {
  AuthEmailVerificationEvent,
  AuthEmailVerificationRes,
} from '@gdk/auth/events/auth-email-verification.event';
import {
  AuthDeleteEvent,
  AuthDeletedUserEvent,
} from '@gdk/auth/events/auth-delete.event';
import {
  AuthEmailSignedUpEvent,
  AuthEmailSignedUpResultEvent,
} from '@gdk/auth/events/auth-email-signed-up.event';
import { SendgridMailService } from '@gdk/mail/sendgrid-mail/sendgrid-mail.service';
import {
  AuthVerifyEvent,
  AuthVerifyResultEvent,
} from '@gdk/auth/events/auth-verify.event';

import {
  AUTH_CODE_USAGE,
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
  ISendGridSendMail,
  LISTENER_ERROR_EVENT,
} from '@shared/types/gdk';
import { RandomNumber } from '@shared/helper/helper';
import Logger from '@shared/loggers/winston.logger';
import { EventListenerErrorEvent } from '@shared/events/event-listener-error.event';
import { MethodLogger } from '@shared/loggers/method-logger.decorator';

import { UserDocument } from '../user.schema';
import { UserService } from '../user.service';
import {
  ICreateUserDto,
  IUpdateUserAuthDto,
  IUpdateUserSignedInDto,
  IUserFullUpdateDto,
} from '../user.type';

@Injectable()
export class UserAuthEventsListener {
  readonly DEFAULT_CODE_EXPIRE_MIN = 5;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly userService: UserService,
    private readonly mailService: SendgridMailService,
  ) {}

  @OnEvent(AUTH_EMAIL_SIGNED_UP_EVENT)
  @MethodLogger()
  async authEmailSignedUpHandler(event: AuthEmailSignedUpEvent) {
    const code = RandomNumber();
    const current = new Date().getTime();
    const expireMin =
      Number(process.env.AUTH_CODE_EXPIRE_MIN) || this.DEFAULT_CODE_EXPIRE_MIN;
    const expiredAt = current + expireMin * 60000;
    const mailDto: ISendGridSendMail = {
      to: event.email,
      subject: `NestJS Starter SignUp Verification`,
      text: `Verification Code :  ${code}`,
      html: `<p>Verification Code : <br>${code}</br> </p>`,
    };
    try {
      let userDoc: UserDocument;
      // * STEP 1. Send Email With Auth Code
      await this.mailService.send(mailDto);
      // * STEP 2. Check If Email Already in MongoDB
      const check: UserDocument = await this.userService.getByEmail(
        event.email,
      );
      if (check === null) {
        // * STEP 2-1. Create User
        const createDto: ICreateUserDto = {
          authId: event.uid,
          authProvider: event.provider,
          authCode: code,
          authCodeExpiredAt: expiredAt,
          authCodeUsage: AUTH_CODE_USAGE.SIGN_UP_VERIFY,
          displayName: event.displayName,
          firstName: event.payload.firstName,
          lastName: event.payload.lastName,
          isEmailVerified: event.isEmailVerified,
          email: event.email,
        };
        userDoc = await this.userService.create(createDto);
      } else {
        // * STEP 2-2. Update User
        const updateDto: IUserFullUpdateDto = {
          authId: event.uid,
          authProvider: event.provider,
          authCode: code,
          authCodeExpiredAt: expiredAt,
          authCodeUsage: AUTH_CODE_USAGE.SIGN_UP_VERIFY,
          displayName: event.displayName,
          firstName: event.payload.firstName,
          lastName: event.payload.lastName,
          isEmailVerified: event.isEmailVerified,
          email: event.email,
        };
        Logger.warn(
          `[UserAuthEventsListener.authEmailSignedUpHandler] ${event.email} user existed before, will update accordingly.`,
        );
        userDoc = await this.userService.updateById(`${check._id}`, updateDto);
      }
      this.eventEmitter.emit(
        AUTH_EMAIL_SIGNED_UP_RESULT_EVENT,
        new AuthEmailSignedUpResultEvent(userDoc),
      );
      return userDoc;
    } catch (error) {
      this.eventEmitter.emit(
        LISTENER_ERROR_EVENT,
        new EventListenerErrorEvent(
          AUTH_EMAIL_SIGNED_UP_EVENT,
          `user/listeners/user-auth-events.listener/authEmailSignedUpHandler`,
          error,
        ),
      );
      return Promise.reject(error);
    }
  }

  @OnEvent(AUTH_EMAIL_VERIFICATION_EVENT)
  @MethodLogger()
  async authEmailVerificationHandler(event: AuthEmailVerificationEvent) {
    const code = RandomNumber();
    const current = new Date().getTime();
    const expireMin =
      Number(process.env.AUTH_CODE_EXPIRE_MIN) || this.DEFAULT_CODE_EXPIRE_MIN;
    const expiredAt = current + expireMin * 60000;
    const mailSubject =
      event.usage === AUTH_CODE_USAGE.SIGN_UP_VERIFY
        ? 'NestJS Starter SignUp Verification'
        : 'NestJs Starter Forgot Password';
    const mailDto: ISendGridSendMail = {
      to: event.email,
      subject: mailSubject,
      text: `Verification Code :  ${code}`,
      html: `<p>Verification Code : <br>${code}</br> </p>`,
    };
    try {
      // * STEP 1. Send Email With Auth Code
      await this.mailService.send(mailDto);
      // * STEP 2. Update User
      const user = await this.userService.getByEmail(event.email);
      const dto: IUpdateUserAuthDto = {
        authCode: code,
        authCodeExpiredAt: expiredAt,
        authCodeUsage: event.usage,
        isEmailVerified: false,
      };
      await this.userService.updateById(`${user._id}`, dto);
      this.eventEmitter.emit(
        AUTH_EMAIL_VERIFICATION_RESULT_EVENT,
        new AuthEmailVerificationRes(event.uid, true, true),
      );
    } catch (error) {
      this.eventEmitter.emit(
        LISTENER_ERROR_EVENT,
        new EventListenerErrorEvent(
          AUTH_EMAIL_VERIFICATION_EVENT,
          `user/listeners/user-auth-events.listener/authEmailVerificationHandler`,
          error,
        ),
      );
      this.eventEmitter.emit(
        AUTH_VERIFY_RESULT_EVENT,
        new AuthVerifyResultEvent(event.uid, event.usage, false),
      );
      return Promise.reject(error);
    }
  }

  @OnEvent(AUTH_VERIFY_AUTH_EVENT)
  @MethodLogger()
  async authVerifyHandler(event: AuthVerifyEvent) {
    try {
      const isPass = await this.userService.verifyAuthState(event);
      this.eventEmitter.emit(
        AUTH_VERIFY_RESULT_EVENT,
        new AuthVerifyResultEvent(event.uid, event.usage, isPass),
      );
    } catch (error) {
      this.eventEmitter.emit(
        LISTENER_ERROR_EVENT,
        new EventListenerErrorEvent(
          AUTH_VERIFY_AUTH_EVENT,
          `user/listeners/user-auth-events.listener/authVerifyHandler`,
          error,
        ),
      );
      this.eventEmitter.emit(
        AUTH_VERIFY_RESULT_EVENT,
        new AuthVerifyResultEvent(event.uid, event.usage, false),
      );
      return Promise.reject(error);
    }
  }

  @OnEvent(AUTH_SIGNED_IN_EVENT)
  @MethodLogger()
  async authSignedInHandler(event: AuthSignedInEvent) {
    try {
      const user = await this.userService.getByEmail(event.email);
      if (user !== null) {
        const dto: IUpdateUserSignedInDto = {
          lastSignInAt: Date.now(),
        };
        const updated = await this.userService.updateById(`${user._id}`, dto);
        return updated;
      }
      throw new Error('User not init in MongoDB');
    } catch (error) {
      this.eventEmitter.emit(
        LISTENER_ERROR_EVENT,
        new EventListenerErrorEvent(
          AUTH_VERIFY_AUTH_EVENT,
          `user/listeners/user-auth-events.listener/authSignedInHandler`,
          error,
        ),
      );
      return Promise.reject(error);
    }
  }

  @OnEvent(AUTH_REQUIRE_USER_DATA_EVENT)
  @MethodLogger()
  async authRequiresUserDataHandler(event: AuthRequireUserDataEvent) {
    try {
      const user = await this.userService.getByEmail(event.email);
      this.eventEmitter.emit(
        AUTH_USER_DATA_RESULT_EVENT,
        new AuthRequireUserDataResultEvent(user),
      );
    } catch (error) {
      this.eventEmitter.emit(
        LISTENER_ERROR_EVENT,
        new EventListenerErrorEvent(
          AUTH_VERIFY_AUTH_EVENT,
          `user/listeners/user-auth-events.listener/authRequiresUserDataHandler`,
          error,
        ),
      );
      return Promise.reject(error);
    }
  }

  @OnEvent(AUTH_DELETE_EVENT)
  @MethodLogger()
  async authDeleteEventHandler(event: AuthDeleteEvent) {
    try {
      const deleted = await this.userService.deleteByAuthId(event.uid);
      this.eventEmitter.emit(
        AUTH_DELETE_USER_RESULT_EVENT,
        new AuthDeletedUserEvent(deleted),
      );
      return deleted;
    } catch (error) {
      console.log(error);
      this.eventEmitter.emit(
        LISTENER_ERROR_EVENT,
        new EventListenerErrorEvent(
          AUTH_VERIFY_AUTH_EVENT,
          `user/listeners/user-auth-events.listener/authDeleteEventHandler`,
          error,
        ),
      );
      return Promise.reject(error);
    }
  }
}
