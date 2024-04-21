import * as request from 'supertest';
import { Connection } from 'mongoose';
import { Test } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { UserRecord } from 'firebase-admin/auth';

import { AppModule } from '@root/app.module';

import { FirebaseAdminAuth } from '@vendors/firebase/firebase-admin-app';
import { FirebaseAuth } from '@vendors/firebase/firebase-app';

import { FirebaseModule } from '@gdk/firebase/firebase.module';
import { UserModule } from '@gdk/user/user.module';
import { UserService } from '@gdk/user/user.service';
import { ICreateUserDto } from '@gdk/user/user.type';
import { MailModule } from '@gdk/mail/mail.module';
import { AuthService } from '@gdk/auth/auth.service';
import { AuthModule } from '@gdk/auth/auth.module';

import { SharedModule } from '@shared/shared.module';
import { RandomNumber } from '@shared/helper/helper';
import {
  AUTH_API,
  AUTH_CODE_USAGE,
  AUTH_PROVIDER,
  AUTH_VERIFICATION_PATH,
  EMAIL_SIGN_IN_PATH,
  EMAIL_SIGN_UP_PATH,
  EMAIL_VERIFICATION_PATH,
  GPI,
  JWT_TOKEN_PATH,
  SIGN_OUT_PATH,
  VER_1,
} from '@shared/types/gdk';

import { GetMockAuthData } from './mock-auth-data-helper';

describe(`Auth GPIs`, () => {
  let app: INestApplication;
  let connection: Connection;
  const mockSignUpAuth01 = GetMockAuthData('0001');
  let mockedSignUpAuth01: UserRecord;
  const mockSignUpAuth02 = GetMockAuthData('0002');
  let mockedSignUpAuth02: UserRecord;
  const mockEmailVerificationAuth01 = GetMockAuthData('0003');
  let mockedEmailVerificationAuth01: UserRecord;
  const mockEmailVerificationAuth02 = GetMockAuthData('0004');
  let mockedEmailVerificationAuth02: UserRecord;
  const mockEmailVerificationAuth03 = GetMockAuthData('0005');
  let mockedEmailVerificationAuth03: UserRecord;
  const mockEmailVerificationAuth04 = GetMockAuthData('0006');
  let mockedEmailVerificationAuth04: UserRecord;
  const mockEmailVerificationAuth05 = GetMockAuthData('0007');
  let mockedEmailVerificationAuth05: UserRecord;
  const mockAuthVerificationAuth01 = GetMockAuthData('0008');
  let mockedAuthVerificationAuth01: UserRecord;
  const mockAuthVerificationAuth02 = GetMockAuthData('0009');
  let mockedAuthVerificationAuth02: UserRecord;
  const mockAuthSignIn01 = GetMockAuthData('0010');
  let mockedAuthSignIn01: UserRecord;
  const mockAuthSignIn02 = GetMockAuthData('0011');
  let mockedAuthSignIn02: UserRecord;
  const mockAuthSignOut01 = GetMockAuthData('0012');
  let mockedAuthSignOut01: UserRecord;
  const mockAuthToken01 = GetMockAuthData('0013');
  let mockedAuthToken01: UserRecord;
  const mockAuthDelete01 = GetMockAuthData('0014');
  let mockedAuthDelete01: UserRecord;
  let userService: UserService;
  let authService: AuthService;
  const GPI_PATH = `/${GPI}/${AUTH_API}`;
  const EMAIL_SIGN_UP_GPI = `${GPI_PATH}/${VER_1}/${EMAIL_SIGN_UP_PATH}`;
  const EMAIL_VERIFICATION_GPI = `${GPI_PATH}/${VER_1}/${EMAIL_VERIFICATION_PATH}`;
  const AUTH_VERIFICATION_GPI = `${GPI_PATH}/${VER_1}/${AUTH_VERIFICATION_PATH}`;
  const EMAIL_SIGN_IN_GPI = `${GPI_PATH}/${VER_1}/${EMAIL_SIGN_IN_PATH}`;
  const SIGN_OUT_GPI = `${GPI_PATH}/${VER_1}/${SIGN_OUT_PATH}`;
  const TOKEN_GPI = `${GPI_PATH}/${VER_1}/${JWT_TOKEN_PATH}`;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        AuthModule,
        FirebaseModule,
        SharedModule,
        MailModule,
        UserModule,
        MongooseModule.forRoot(
          `${
            process.env.MONGO_URI || 'mongodb://localhost:27017?replicaSet=rs'
          }`,
          {
            autoCreate: true,
            dbName: `${process.env.MONGO_DB_NAME || 'nestjs-starter'}`,
          },
        ),
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    connection = await moduleRef.get(getConnectionToken());
    userService = moduleRef.get<UserService>(UserService);
    authService = moduleRef.get<AuthService>(AuthService);
    await app.init();
  });
  describe(`[POST] ${EMAIL_SIGN_UP_GPI}`, () => {
    it('Empty body, should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_UP_GPI}`)
        .send({})
        .expect(400);
    });
    it('Invalid email (string), should throw 400', () => {
      const testAuth = GetMockAuthData(RandomNumber(4));
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_UP_GPI}`)
        .send({
          ...testAuth,
          email: 'invalid',
        })
        .expect(400);
    });
    it('Invalid email (boolean), should throw 400', () => {
      const testAuth = GetMockAuthData(RandomNumber(4));
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_UP_GPI}`)
        .send({
          ...testAuth,
          email: true,
        })
        .expect(400);
    });
    it('Invalid email (number), should throw 400', () => {
      const testAuth = GetMockAuthData(RandomNumber(4));
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_UP_GPI}`)
        .send({
          ...testAuth,
          email: 10001584,
        })
        .expect(400);
    });
    it('Invalid password length (5), should throw 400', () => {
      const testAuth = GetMockAuthData(RandomNumber(4));
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_UP_GPI}`)
        .send({
          ...testAuth,
          password: 'aaa@1',
        })
        .expect(400);
    });
    it('Empty firstName, should throw 400', () => {
      const testAuth = GetMockAuthData(RandomNumber(4));
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_UP_GPI}`)
        .send({
          ...testAuth,
          firstName: '',
        })
        .expect(400);
    });
    it('Empty lastName, should throw 400', () => {
      const testAuth = GetMockAuthData(RandomNumber(4));
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_UP_GPI}`)
        .send({
          ...testAuth,
          lastName: '',
        })
        .expect(400);
    });
    it('Valid body, should return 201', async () => {
      const res = await request(app.getHttpServer())
        .post(`${EMAIL_SIGN_UP_GPI}`)
        .send(mockSignUpAuth01);
      expect(res.status).toEqual(201);
      mockedSignUpAuth01 = await FirebaseAdminAuth.getUserByEmail(
        mockSignUpAuth01.email,
      );
      const user = await userService.getByEmail(mockSignUpAuth01.email);
      expect(user.authId).toEqual(mockedSignUpAuth01.uid);
      expect(user.authCodeExpiredAt).toBeGreaterThan(new Date().getTime());
      expect(user.authCodeUsage).toEqual(AUTH_CODE_USAGE.SIGN_UP_VERIFY);
      expect(user.authCode).toBeDefined();
      expect(user.isEmailVerified).toBeFalsy();
      expect(user.firstName).toBe(mockSignUpAuth01.firstName);
      expect(user.lastName).toBe(mockSignUpAuth01.lastName);
      expect(user.displayName).toBe(mockSignUpAuth01.displayName);
    });
    it('Valid body with empty displayName, should return 201', async () => {
      const res = await request(app.getHttpServer())
        .post(`${EMAIL_SIGN_UP_GPI}`)
        .send({
          ...mockSignUpAuth02,
          displayName: '',
        });
      expect(res.status).toEqual(201);
      mockedSignUpAuth02 = await FirebaseAdminAuth.getUserByEmail(
        mockSignUpAuth02.email,
      );
      const user = await userService.getByEmail(mockSignUpAuth02.email);
      expect(user.authId).toEqual(mockedSignUpAuth02.uid);
      expect(user.authCodeExpiredAt).toBeGreaterThan(new Date().getTime());
      expect(user.authCodeUsage).toEqual(AUTH_CODE_USAGE.SIGN_UP_VERIFY);
      expect(user.authCode).toBeDefined();
      expect(user.isEmailVerified).toBeFalsy();
      expect(user.firstName).toBe(mockSignUpAuth02.firstName);
      expect(user.lastName).toBe(mockSignUpAuth02.lastName);
      expect(user.displayName).toBe(
        `${mockSignUpAuth02.firstName}_${mockSignUpAuth02.lastName}`,
      );
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedSignUpAuth01.uid);
      await FirebaseAdminAuth.deleteUser(mockedSignUpAuth02.uid);
      await userService.deleteByAuthId(mockedSignUpAuth01.uid);
      await userService.deleteByAuthId(mockedSignUpAuth02.uid);
    });
  });
  describe(`[POST] ${EMAIL_VERIFICATION_GPI}`, () => {
    it('Empty body, should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({})
        .expect(400);
    });
    it('Invalid email (string), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: AUTH_CODE_USAGE.SIGN_UP_VERIFY,
          email: 'invalid',
        })
        .expect(400);
    });
    it('Invalid email (boolean), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: AUTH_CODE_USAGE.SIGN_UP_VERIFY,
          email: true,
        })
        .expect(400);
    });
    it('Invalid email (number), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: AUTH_CODE_USAGE.SIGN_UP_VERIFY,
          email: 10001584,
        })
        .expect(400);
    });
    it(`Invalid usage (empty string), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: '',
          email: 'test@evolabs.io',
        })
        .expect(400);
    });
    it(`Invalid usage (number), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: 3849493,
          email: 'test@evolabs.io',
        })
        .expect(400);
    });
    it(`Invalid usage (boolean), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: true,
          email: 'test@evolabs.io',
        })
        .expect(400);
    });
    it(`Invalid usage (${AUTH_CODE_USAGE.NOT_SET}), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: AUTH_CODE_USAGE.NOT_SET,
          email: 'test@evolabs.io',
        })
        .expect(400);
    });
    it(`Invalid usage (${AUTH_CODE_USAGE.PHONE_VERIFY}), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: AUTH_CODE_USAGE.PHONE_VERIFY,
          email: 'test@evolabs.io',
        })
        .expect(400);
    });
    it(`Invalid usage (${AUTH_CODE_USAGE.CHANGE_PASSWORD}), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: AUTH_CODE_USAGE.CHANGE_PASSWORD,
          email: 'test@evolabs.io',
        })
        .expect(400);
    });
    it(`Usage (${AUTH_CODE_USAGE.SIGN_UP_VERIFY}), but auth email already verified, should throw 400`, async () => {
      await FirebaseAdminAuth.createUser({
        email: mockEmailVerificationAuth01.email,
        password: mockEmailVerificationAuth01.password,
        displayName: mockEmailVerificationAuth01.displayName,
        emailVerified: true,
        disabled: false,
      });
      mockedEmailVerificationAuth01 = await FirebaseAdminAuth.getUserByEmail(
        mockEmailVerificationAuth01.email,
      );
      const res = await request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: AUTH_CODE_USAGE.SIGN_UP_VERIFY,
          email: mockEmailVerificationAuth01.email,
        });
      expect(res.status).toEqual(400);
    });
    it(`Usage (${AUTH_CODE_USAGE.FORGOT_PASSWORD}), but auth email not verified, should throw 400`, async () => {
      await FirebaseAdminAuth.createUser({
        email: mockEmailVerificationAuth02.email,
        password: mockEmailVerificationAuth02.password,
        displayName: mockEmailVerificationAuth02.displayName,
        emailVerified: false,
        disabled: false,
      });
      mockedEmailVerificationAuth02 = await FirebaseAdminAuth.getUserByEmail(
        mockEmailVerificationAuth02.email,
      );
      const res = await request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
          email: mockEmailVerificationAuth02.email,
        });
      expect(res.status).toEqual(400);
    });
    it(`User resource not created, should throw 500`, async () => {
      await FirebaseAdminAuth.createUser({
        email: mockEmailVerificationAuth03.email,
        password: mockEmailVerificationAuth03.password,
        displayName: mockEmailVerificationAuth03.displayName,
        emailVerified: false,
        disabled: false,
      });
      mockedEmailVerificationAuth03 = await FirebaseAdminAuth.getUserByEmail(
        mockEmailVerificationAuth03.email,
      );
      const res = await request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: AUTH_CODE_USAGE.SIGN_UP_VERIFY,
          email: mockEmailVerificationAuth03.email,
        });
      expect(res.status).toEqual(500);
    }, 10000);
    it(`Usage (${AUTH_CODE_USAGE.SIGN_UP_VERIFY}) Valid setup, should return 201`, async () => {
      // * Setup MockedUser for Valid case
      await FirebaseAdminAuth.createUser({
        email: mockEmailVerificationAuth04.email,
        password: mockEmailVerificationAuth04.password,
        displayName: mockEmailVerificationAuth04.displayName,
        emailVerified: false,
        disabled: false,
      });
      mockedEmailVerificationAuth04 = await FirebaseAdminAuth.getUserByEmail(
        mockEmailVerificationAuth04.email,
      );
      const createDto: ICreateUserDto = {
        authId: mockedEmailVerificationAuth04.uid,
        authProvider: AUTH_PROVIDER.FIREBASE,
        authCode: `${RandomNumber()}`,
        authCodeExpiredAt: 0,
        authCodeUsage: AUTH_CODE_USAGE.NOT_SET,
        displayName: mockEmailVerificationAuth04.displayName,
        firstName: mockEmailVerificationAuth04.firstName,
        lastName: mockEmailVerificationAuth04.lastName,
        isEmailVerified: false,
        email: mockEmailVerificationAuth04.email,
      };
      await userService.create(createDto);
      const res = await request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: AUTH_CODE_USAGE.SIGN_UP_VERIFY,
          email: mockEmailVerificationAuth04.email,
        });
      expect(res.status).toEqual(201);
      // * Check MongoUser
      const user = await userService.getByEmail(
        mockEmailVerificationAuth04.email,
      );
      expect(user).toBeDefined();
      expect(user.authCodeExpiredAt).toBeGreaterThan(new Date().getTime());
      expect(user.authCode).toBeDefined();
      expect(user.authCodeUsage).toEqual(AUTH_CODE_USAGE.SIGN_UP_VERIFY);
      expect(user.authProvider).toEqual(AUTH_PROVIDER.FIREBASE);
    }, 10000);
    it(`Usage (${AUTH_CODE_USAGE.FORGOT_PASSWORD}) Valid setup, should return 201`, async () => {
      // * Setup MockedUser for Valid case
      await FirebaseAdminAuth.createUser({
        email: mockEmailVerificationAuth05.email,
        password: mockEmailVerificationAuth05.password,
        displayName: mockEmailVerificationAuth05.displayName,
        emailVerified: true,
        disabled: false,
      });
      mockedEmailVerificationAuth05 = await FirebaseAdminAuth.getUserByEmail(
        mockEmailVerificationAuth05.email,
      );
      const createDto: ICreateUserDto = {
        authId: mockedEmailVerificationAuth05.uid,
        authProvider: AUTH_PROVIDER.FIREBASE,
        authCode: `${RandomNumber()}`,
        authCodeExpiredAt: 0,
        authCodeUsage: AUTH_CODE_USAGE.NOT_SET,
        displayName: mockEmailVerificationAuth05.displayName,
        firstName: mockEmailVerificationAuth05.firstName,
        lastName: mockEmailVerificationAuth05.lastName,
        isEmailVerified: true,
        email: mockEmailVerificationAuth05.email,
      };
      await userService.create(createDto);
      const res = await request(app.getHttpServer())
        .post(`${EMAIL_VERIFICATION_GPI}`)
        .send({
          usage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
          email: mockEmailVerificationAuth05.email,
        });
      expect(res.status).toEqual(201);
      // * Check MongoUser
      const user = await userService.getByEmail(
        mockEmailVerificationAuth05.email,
      );
      expect(user).toBeDefined();
      expect(user.authCodeExpiredAt).toBeGreaterThan(new Date().getTime());
      expect(user.authCode).toBeDefined();
      expect(user.authCodeUsage).toEqual(AUTH_CODE_USAGE.FORGOT_PASSWORD);
      expect(user.authProvider).toEqual(AUTH_PROVIDER.FIREBASE);
    }, 10000);
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedEmailVerificationAuth01.uid);
      await FirebaseAdminAuth.deleteUser(mockedEmailVerificationAuth02.uid);
      await FirebaseAdminAuth.deleteUser(mockedEmailVerificationAuth03.uid);
      await FirebaseAdminAuth.deleteUser(mockedEmailVerificationAuth04.uid);
      await userService.deleteByAuthId(mockedEmailVerificationAuth04.uid);
      await FirebaseAdminAuth.deleteUser(mockedEmailVerificationAuth05.uid);
      await userService.deleteByAuthId(mockedEmailVerificationAuth05.uid);
    });
  });
  describe(`[POST] ${AUTH_VERIFICATION_GPI}`, () => {
    it('Empty body, should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({})
        .expect(400);
    });
    it('Invalid email (string), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '12345',
          email: 'evolab',
          code: '123456',
          usage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
          newPassword: '123456',
        })
        .expect(400);
    });
    it('Invalid email (number), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '12345',
          email: 49594939,
          code: '123456',
          usage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
          newPassword: '123456',
        })
        .expect(400);
    });
    it('Invalid email (boolean), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '12345',
          email: true,
          code: '123456',
          usage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
          newPassword: '123456',
        })
        .expect(400);
    });
    it('Invalid uid (empty), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '',
          email: 'jester@evolabs.io',
          code: '123456',
          usage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
          newPassword: '123456',
        })
        .expect(400);
    });
    it('Invalid uid (number), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: 123456,
          email: 'jester@evolabs.io',
          code: '123456',
          usage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
          newPassword: '123456',
        })
        .expect(400);
    });
    it('Invalid uid (boolean), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: false,
          email: 'jester@evolabs.io',
          code: '123456',
          usage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
          newPassword: '123456',
        })
        .expect(400);
    });
    it('Invalid code (empty), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '123456',
          email: 'jester@evolabs.io',
          code: '',
          usage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
          newPassword: '123456',
        })
        .expect(400);
    });
    it('Invalid code (number), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '123456',
          email: 'jester@evolabs.io',
          code: 123456,
          usage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
          newPassword: '123456',
        })
        .expect(400);
    });
    it('Invalid code (boolean), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '123456',
          email: 'jester@evolabs.io',
          code: true,
          usage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
          newPassword: '123456',
        })
        .expect(400);
    });
    it('Invalid usage (empty), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '123456',
          email: 'jester@evolabs.io',
          code: '123456',
          usage: '',
          newPassword: '123456',
        })
        .expect(400);
    });
    it(`Invalid usage (${AUTH_CODE_USAGE.CHANGE_PASSWORD}), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '123456',
          email: 'jester@evolabs.io',
          code: '123456',
          usage: AUTH_CODE_USAGE.CHANGE_PASSWORD,
          newPassword: '123456',
        })
        .expect(400);
    });
    it(`Invalid usage (${AUTH_CODE_USAGE.NOT_SET}), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '123456',
          email: 'jester@evolabs.io',
          code: '123456',
          usage: AUTH_CODE_USAGE.NOT_SET,
          newPassword: '123456',
        })
        .expect(400);
    });
    it(`Invalid usage (${AUTH_CODE_USAGE.PHONE_VERIFY}), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '123456',
          email: 'jester@evolabs.io',
          code: '123456',
          usage: AUTH_CODE_USAGE.PHONE_VERIFY,
          newPassword: '123456',
        })
        .expect(400);
    });
    it('Invalid password (less than 6 length), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '123456',
          email: 'jester@evolabs.io',
          code: '123456',
          usage: AUTH_CODE_USAGE.CHANGE_PASSWORD,
          newPassword: '12345',
        })
        .expect(400);
    });
    it('Invalid password (empty), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '123456',
          email: 'jester@evolabs.io',
          code: '123456',
          usage: AUTH_CODE_USAGE.CHANGE_PASSWORD,
          newPassword: '',
        })
        .expect(400);
    });
    it('Invalid password (number), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '123456',
          email: 'jester@evolabs.io',
          code: '123456',
          usage: AUTH_CODE_USAGE.CHANGE_PASSWORD,
          newPassword: 123456789499,
        })
        .expect(400);
    });
    it('Invalid password (boolean), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: '123456',
          email: 'jester@evolabs.io',
          code: '123456',
          usage: AUTH_CODE_USAGE.CHANGE_PASSWORD,
          newPassword: true,
        })
        .expect(400);
    });
    it(`Usage ${AUTH_CODE_USAGE.SIGN_UP_VERIFY}, Valid setup, should return 201`, async () => {
      await FirebaseAdminAuth.createUser({
        email: mockAuthVerificationAuth01.email,
        password: mockAuthVerificationAuth01.password,
        displayName: mockAuthVerificationAuth01.displayName,
        emailVerified: false,
        disabled: false,
      });
      mockedAuthVerificationAuth01 = await FirebaseAdminAuth.getUserByEmail(
        mockAuthVerificationAuth01.email,
      );
      // * Mock Already Assigned Usage
      const targetAuthCode = `${RandomNumber()}`;
      const expiredAt = new Date().getTime() + 3 * 60000;
      const createDto: ICreateUserDto = {
        authId: mockedAuthVerificationAuth01.uid,
        authProvider: AUTH_PROVIDER.FIREBASE,
        authCode: targetAuthCode,
        authCodeExpiredAt: expiredAt,
        authCodeUsage: AUTH_CODE_USAGE.SIGN_UP_VERIFY,
        displayName: mockAuthVerificationAuth01.displayName,
        firstName: mockAuthVerificationAuth01.firstName,
        lastName: mockAuthVerificationAuth01.lastName,
        isEmailVerified: false,
        email: mockAuthVerificationAuth01.email,
      };
      await userService.create(createDto);
      const res = await request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: mockedAuthVerificationAuth01.uid,
          email: mockAuthVerificationAuth01.email,
          usage: AUTH_CODE_USAGE.SIGN_UP_VERIFY,
          code: targetAuthCode,
        });
      expect(res.status).toBe(201);
      const user = await userService.getByEmail(
        mockAuthVerificationAuth01.email,
      );
      expect(user).toBeDefined();
      // * AuthCode should reset
      expect(user.authCodeExpiredAt).toBe(0);
      expect(user.authCodeUsage).toBe(AUTH_CODE_USAGE.NOT_SET);
      expect(user.authCode).toBe('');
      expect(user.isEmailVerified).toBeTruthy();
      const auth = await FirebaseAdminAuth.getUser(
        mockedAuthVerificationAuth01.uid,
      );
      expect(auth.emailVerified).toBeTruthy();
    }, 10000);
    it(`Usage ${AUTH_CODE_USAGE.FORGOT_PASSWORD}, Valid setup, should return 201`, async () => {
      const oldPassword = '123456';
      const newPassword = '7891234';
      await FirebaseAdminAuth.createUser({
        email: mockAuthVerificationAuth02.email,
        password: oldPassword,
        displayName: mockAuthVerificationAuth02.displayName,
        emailVerified: true,
        disabled: false,
      });
      mockedAuthVerificationAuth02 = await FirebaseAdminAuth.getUserByEmail(
        mockAuthVerificationAuth02.email,
      );
      // * Mock Already Assigned Usage
      const targetAuthCode = `${RandomNumber()}`;
      const expiredAt = new Date().getTime() + 3 * 60000;
      const createDto: ICreateUserDto = {
        authId: mockedAuthVerificationAuth02.uid,
        authProvider: AUTH_PROVIDER.FIREBASE,
        authCode: targetAuthCode,
        authCodeExpiredAt: expiredAt,
        authCodeUsage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
        displayName: mockAuthVerificationAuth02.displayName,
        firstName: mockAuthVerificationAuth02.firstName,
        lastName: mockAuthVerificationAuth02.lastName,
        isEmailVerified: true,
        email: mockAuthVerificationAuth02.email,
      };
      await userService.create(createDto);
      const res = await request(app.getHttpServer())
        .post(`${AUTH_VERIFICATION_GPI}`)
        .send({
          uid: mockedAuthVerificationAuth02.uid,
          email: mockAuthVerificationAuth02.email,
          usage: AUTH_CODE_USAGE.FORGOT_PASSWORD,
          code: targetAuthCode,
          newPassword: newPassword,
        });
      expect(res.status).toBe(201);
      const user = await userService.getByEmail(
        mockAuthVerificationAuth02.email,
      );
      expect(user).toBeDefined();
      // * AuthCode should reset
      expect(user.authCodeExpiredAt).toBe(0);
      expect(user.authCodeUsage).toBe(AUTH_CODE_USAGE.NOT_SET);
      expect(user.authCode).toBe('');
      const auth = await FirebaseAdminAuth.getUser(
        mockedAuthVerificationAuth02.uid,
      );
      expect(auth.emailVerified).toBeTruthy();
      const checkNewPassword = await signInWithEmailAndPassword(
        FirebaseAuth,
        mockAuthVerificationAuth02.email,
        newPassword,
      );
      expect(checkNewPassword).toBeDefined();
    }, 10000);
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuthVerificationAuth01.uid);
      await FirebaseAdminAuth.deleteUser(mockedAuthVerificationAuth02.uid);
      await userService.deleteByAuthId(mockedAuthVerificationAuth01.uid);
      await userService.deleteByAuthId(mockedAuthVerificationAuth02.uid);
    });
  });
  describe(`[POST] ${EMAIL_SIGN_IN_GPI}`, () => {
    it('Empty body, should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({})
        .expect(400);
    });
    it('Invalid email(empty), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: '',
          password: '123456',
        })
        .expect(400);
    });
    it('Invalid email(number), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: 10234599,
          password: '123456',
        })
        .expect(400);
    });
    it('Invalid email(boolean), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: true,
          password: '123456',
        })
        .expect(400);
    });
    it('Invalid email(string), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: 'evolab',
          password: '123456',
        })
        .expect(400);
    });
    it('Invalid password(empty), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: 'evolab@gmail.com',
        })
        .expect(400);
    });
    it('Invalid password(less than 6), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: 'evolab@gmail.com',
          password: '12345',
        })
        .expect(400);
    });
    it('Not exist email password, should throw 404', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: 'not-exist@abc.com',
          password: '123456',
        })
        .expect(404);
    });
    it(`Email not verified, should return 401`, async () => {
      // * Setup User
      await FirebaseAdminAuth.createUser({
        email: mockAuthSignIn01.email,
        password: mockAuthSignIn01.password,
        displayName: mockAuthSignIn01.displayName,
        emailVerified: false,
        disabled: false,
      });
      mockedAuthSignIn01 = await FirebaseAdminAuth.getUserByEmail(
        mockAuthSignIn01.email,
      );
      const res = await request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: mockAuthSignIn01.email,
          password: mockAuthSignIn01.password,
        });
      expect(res.status).toEqual(401);
    });
    it(`Valid setup, should return 201`, async () => {
      // * Setup User
      await FirebaseAdminAuth.createUser({
        email: mockAuthSignIn02.email,
        password: mockAuthSignIn02.password,
        displayName: mockAuthSignIn02.displayName,
        emailVerified: true,
        disabled: false,
      });
      mockedAuthSignIn02 = await FirebaseAdminAuth.getUserByEmail(
        mockAuthSignIn02.email,
      );
      const createDto: ICreateUserDto = {
        authId: mockedAuthSignIn02.uid,
        authProvider: AUTH_PROVIDER.FIREBASE,
        authCode: `${RandomNumber()}`,
        authCodeExpiredAt: 0,
        authCodeUsage: AUTH_CODE_USAGE.NOT_SET,
        displayName: mockAuthSignIn02.displayName,
        firstName: mockAuthSignIn02.firstName,
        lastName: mockAuthSignIn02.lastName,
        isEmailVerified: true,
        email: mockAuthSignIn02.email,
      };
      await userService.create(createDto);
      const res = await request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: mockAuthSignIn02.email,
          password: mockAuthSignIn02.password,
        });
      expect(res.status).toEqual(201);
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuthSignIn01.uid);
      await FirebaseAdminAuth.deleteUser(mockedAuthSignIn02.uid);
      await userService.deleteByAuthId(mockedAuthSignIn02.uid);
    });
  });
  describe(`[POST] ${SIGN_OUT_GPI}`, () => {
    it('Authorization header not set, should return 401', () => {
      return request(app.getHttpServer()).post(`${SIGN_OUT_GPI}`).expect(401);
    });
    it('Authorization with valid token, should return 201', async () => {
      await FirebaseAdminAuth.createUser({
        email: mockAuthSignOut01.email,
        password: mockAuthSignOut01.password,
        displayName: mockAuthSignOut01.displayName,
        emailVerified: true,
        disabled: false,
      });
      mockedAuthSignOut01 = await FirebaseAdminAuth.getUserByEmail(
        mockAuthSignOut01.email,
      );
      const createDto: ICreateUserDto = {
        authId: mockedAuthSignOut01.uid,
        authProvider: AUTH_PROVIDER.FIREBASE,
        authCode: `${RandomNumber()}`,
        authCodeExpiredAt: 0,
        authCodeUsage: AUTH_CODE_USAGE.NOT_SET,
        displayName: mockAuthSignOut01.displayName,
        firstName: mockAuthSignOut01.firstName,
        lastName: mockAuthSignOut01.lastName,
        isEmailVerified: true,
        email: mockAuthSignOut01.email,
      };
      await userService.create(createDto);
      const cred = await authService.signInWithEmailPasswordV1({
        email: mockAuthSignOut01.email,
        password: mockAuthSignOut01.password,
      });
      // * Sign In
      const res = await request(app.getHttpServer())
        .post(`${SIGN_OUT_GPI}`)
        .set('Authorization', `Bearer ${cred.accessToken}`);
      expect(res.status).toEqual(201);
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuthSignOut01.uid);
      await userService.deleteByAuthId(mockedAuthSignOut01.uid);
    });
  });
  describe(`[GET] ${TOKEN_GPI}`, () => {
    it('Authorization header not set, should return 401', () => {
      return request(app.getHttpServer()).get(`${TOKEN_GPI}`).expect(401);
    });
    it('Authorization with valid token, should return 201', async () => {
      await FirebaseAdminAuth.createUser({
        email: mockAuthToken01.email,
        password: mockAuthToken01.password,
        displayName: mockAuthToken01.displayName,
        emailVerified: true,
        disabled: false,
      });
      mockedAuthToken01 = await FirebaseAdminAuth.getUserByEmail(
        mockAuthToken01.email,
      );
      const createDto: ICreateUserDto = {
        authId: mockedAuthToken01.uid,
        authProvider: AUTH_PROVIDER.FIREBASE,
        authCode: `${RandomNumber()}`,
        authCodeExpiredAt: 0,
        authCodeUsage: AUTH_CODE_USAGE.NOT_SET,
        displayName: mockAuthToken01.displayName,
        firstName: mockAuthToken01.firstName,
        lastName: mockAuthToken01.lastName,
        isEmailVerified: true,
        email: mockAuthToken01.email,
      };
      await userService.create(createDto);
      // * Sign In
      const cred = await authService.signInWithEmailPasswordV1({
        email: mockAuthToken01.email,
        password: mockAuthToken01.password,
      });
      const res = await request(app.getHttpServer())
        .get(`${TOKEN_GPI}`)
        .set('Authorization', `Bearer ${cred.accessToken}`);
      expect(res.status).toEqual(200);
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuthToken01.uid);
      await userService.deleteByAuthId(mockedAuthToken01.uid);
    });
  });
  describe(`[DELETE] ${GPI_PATH}/:uid`, () => {
    it('Authorization header not set, should return 401', () => {
      return request(app.getHttpServer())
        .delete(`${GPI_PATH}/${VER_1}/12345`)
        .expect(401);
    });
    it('Authorization with valid token, should return 200', async () => {
      // * Setup User
      await FirebaseAdminAuth.createUser({
        email: mockAuthDelete01.email,
        password: mockAuthDelete01.password,
        displayName: mockAuthDelete01.displayName,
        emailVerified: true,
        disabled: false,
      });
      mockedAuthDelete01 = await FirebaseAdminAuth.getUserByEmail(
        mockAuthDelete01.email,
      );
      const createDto: ICreateUserDto = {
        authId: mockedAuthDelete01.uid,
        authProvider: AUTH_PROVIDER.FIREBASE,
        authCode: `${RandomNumber()}`,
        authCodeExpiredAt: 0,
        authCodeUsage: AUTH_CODE_USAGE.NOT_SET,
        displayName: mockAuthDelete01.displayName,
        firstName: mockAuthDelete01.firstName,
        lastName: mockAuthDelete01.lastName,
        isEmailVerified: true,
        email: mockAuthDelete01.email,
      };
      await userService.create(createDto);
      // * Sign In
      const cred = await authService.signInWithEmailPasswordV1({
        email: mockAuthDelete01.email,
        password: mockAuthDelete01.password,
      });
      const res = await request(app.getHttpServer())
        .delete(`${GPI_PATH}/${VER_1}/${mockedAuthDelete01.uid}`)
        .set('Authorization', `Bearer ${cred.accessToken}`);
      expect(res.status).toEqual(200);
      const user = await userService.getByEmail(mockAuthDelete01.email);
      expect(user).toBeNull();
    });
  });
  afterAll(async () => {
    setTimeout(async () => {
      await connection.close(true);
    }, 1500);
  });
});
