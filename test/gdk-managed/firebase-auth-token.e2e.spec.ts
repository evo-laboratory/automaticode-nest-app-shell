import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { UserRecord } from 'firebase-admin/auth';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { UserCredential, signInWithCustomToken } from 'firebase/auth';
import {
  CUSTOM_TOKEN_PATH,
  EMAIL_PATH,
  FIREBASE_AUTH_API,
  GPI,
  ID_TOKEN_VALIDATION_PATH,
  SIGN_IN_PATH,
  USER_CUSTOM_TOKEN_PATH,
  VER_1,
} from '@shared/types/gdk';
import { FirebaseAuthController } from '@gdk/firebase/firebase-auth/firebase-auth.controller';
import { FirebaseAuthService } from '@gdk/firebase/firebase-auth/firebase-auth.service';
import { FirebaseModule } from '@gdk/firebase/firebase.module';
import { FirebaseAdminAuth } from '@vendors/firebase/firebase-admin-app';
import { FirebaseAuth } from '@vendors/firebase/firebase-app';

import { GetMockFirebaseAuthData } from './mock-auth-data-helper';

describe(`Firebase Auth GPIs - Token`, () => {
  let app: INestApplication;
  const GPI_PATH = `/${GPI}/${FIREBASE_AUTH_API}`;
  const AUTH_PATH = `${GPI_PATH}/${VER_1}`;
  const CUSTOM_TOKEN_GPI = `${AUTH_PATH}/${CUSTOM_TOKEN_PATH}`;
  const USER_CUSTOM_TOKEN_GPI = `${AUTH_PATH}/${USER_CUSTOM_TOKEN_PATH}`;
  const TOKEN_SIGN_IN_GPI = `${CUSTOM_TOKEN_GPI}/${SIGN_IN_PATH}`;
  const EMAIL_SIGN_IN_GPI = `${AUTH_PATH}/${EMAIL_PATH}/${SIGN_IN_PATH}`;
  const ID_TOKEN_VALIDATION_GPI = `${AUTH_PATH}/${ID_TOKEN_VALIDATION_PATH}`;
  const USER_TOKEN_SIGN_IN_GPI = `${AUTH_PATH}/${USER_CUSTOM_TOKEN_PATH}/${SIGN_IN_PATH}`;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FirebaseModule],
      controllers: [FirebaseAuthController],
      providers: [FirebaseAuthService],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
  });
  describe(`[POST] ${CUSTOM_TOKEN_GPI}`, () => {
    const TEST_PAYLOAD = {
      testString: 'I am a string',
      testNumber: 1000,
      testBoolean: true,
      testArray: ['item1', 'item2', 'item3'],
    };
    const INTEND_UID = '1234';
    it('Empty body, should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .expect(400);
    });
    it('Invalid uid (boolean), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .send({
          uid: true,
          signPayload: TEST_PAYLOAD,
        })
        .expect(400);
    });
    it('Invalid uid (number), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .send({
          uid: 5000,
          signPayload: TEST_PAYLOAD,
        })
        .expect(400);
    });
    it('Invalid uid (empty string), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .send({
          uid: '',
          signPayload: TEST_PAYLOAD,
        })
        .expect(400);
    });
    it('Invalid signPayload (empty string), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .send({
          uid: '1234',
          signPayload: 'string',
        })
        .expect(400);
    });
    it('Invalid signPayload (number), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .send({
          uid: '1234',
          signPayload: 1234,
        })
        .expect(400);
    });
    it('Invalid signPayload (boolean), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .send({
          uid: '1234',
          signPayload: false,
        })
        .expect(400);
    });
    it('Invalid signPayload (null), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .send({
          uid: '1234',
          signPayload: null,
        })
        .expect(400);
    });
    it('Invalid signPayload (not passing), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .send({
          uid: '1234',
        })
        .expect(400);
    });
    it('Valid body, should return 201 and with signInToken ', async () => {
      const res = await request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .send({
          uid: INTEND_UID,
          signPayload: TEST_PAYLOAD,
        });
      const decoded = jwt.decode(res.body.signInToken) as jwt.JwtPayload;
      expect(res.status).toEqual(201);
      expect(res.body.signInToken).toBeDefined();
      // * Decoded signInToken structure test
      expect(decoded.aud).toBeDefined();
      expect(typeof decoded.aud).toBe('string');
      expect(decoded.iat).toBeDefined();
      expect(typeof decoded.iat).toBe('number');
      expect(decoded.exp).toBeDefined();
      expect(typeof decoded.exp).toBe('number');
      expect(decoded.iss).toBeDefined();
      expect(typeof decoded.iss).toBe('string');
      expect(decoded.sub).toBeDefined();
      expect(typeof decoded.sub).toBe('string');
      expect(decoded.uid).toBeDefined();
      expect(typeof decoded.uid).toBe('string');
      expect(decoded.uid).toEqual(INTEND_UID);
    });
    it('Valid body, should return 201 and with decoded payload sent (under claims) ', async () => {
      const res = await request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .send({
          uid: INTEND_UID,
          signPayload: TEST_PAYLOAD,
        });
      const decoded = jwt.decode(res.body.signInToken) as jwt.JwtPayload;
      expect(res.status).toEqual(201);
      expect(res.body.signInToken).toBeDefined();
      // * Decoded signInToken structure test
      expect(decoded.claims).toBeDefined();
      expect(JSON.stringify(decoded.claims)).toEqual(
        JSON.stringify(TEST_PAYLOAD),
      );
    });
  });
  describe(`[POST] ${USER_CUSTOM_TOKEN_GPI}`, () => {
    let mockedAuth: UserRecord;
    const TEST_USER_PAYLOAD = {
      testString: 'I am a string',
      testNumber: 1000,
      testBoolean: true,
      testArray: ['item1', 'item2', 'item3'],
    };
    const INTEND_INVALID_UID = '1234';
    beforeAll(async () => {
      // * Create to get uid
      mockedAuth = await FirebaseAdminAuth.createUser(
        GetMockFirebaseAuthData('001'),
      );
    });
    it('Empty body, should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${USER_CUSTOM_TOKEN_GPI}`)
        .expect(400);
    });
    it('Invalid uid (boolean), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${USER_CUSTOM_TOKEN_GPI}`)
        .send({
          uid: true,
          signPayload: TEST_USER_PAYLOAD,
        })
        .expect(400);
    });
    it('Invalid uid (number), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${USER_CUSTOM_TOKEN_GPI}`)
        .send({
          uid: 5000,
          signPayload: TEST_USER_PAYLOAD,
        })
        .expect(400);
    });
    it('Invalid uid (empty string), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${USER_CUSTOM_TOKEN_GPI}`)
        .send({
          uid: '',
          signPayload: TEST_USER_PAYLOAD,
        })
        .expect(400);
    });
    it('Invalid uid (not exist), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${USER_CUSTOM_TOKEN_GPI}`)
        .send({
          uid: INTEND_INVALID_UID,
          signPayload: TEST_USER_PAYLOAD,
        })
        .expect(404);
    });
    it('Invalid signPayload (empty string), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${USER_CUSTOM_TOKEN_GPI}`)
        .send({
          uid: '1234',
          signPayload: 'string',
        })
        .expect(400);
    });
    it('Invalid signPayload (number), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${USER_CUSTOM_TOKEN_GPI}`)
        .send({
          uid: '1234',
          signPayload: 1234,
        })
        .expect(400);
    });
    it('Invalid signPayload (boolean), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${USER_CUSTOM_TOKEN_GPI}`)
        .send({
          uid: '1234',
          signPayload: false,
        })
        .expect(400);
    });
    it('Invalid signPayload (null), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${USER_CUSTOM_TOKEN_GPI}`)
        .send({
          uid: '1234',
          signPayload: null,
        })
        .expect(400);
    });
    it('Invalid signPayload (not passing), should throw 400 ', () => {
      return request(app.getHttpServer())
        .post(`${USER_CUSTOM_TOKEN_GPI}`)
        .send({
          uid: '1234',
        })
        .expect(400);
    });
    it('Valid body (existed user), should return 201 and with signInToken ', async () => {
      const res = await request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .send({
          uid: mockedAuth.uid,
          signPayload: TEST_USER_PAYLOAD,
        });
      const decoded = jwt.decode(res.body.signInToken) as jwt.JwtPayload;
      expect(res.status).toEqual(201);
      expect(res.body.signInToken).toBeDefined();
      // * Decoded signInToken structure test
      expect(decoded.aud).toBeDefined();
      expect(typeof decoded.aud).toBe('string');
      expect(decoded.iat).toBeDefined();
      expect(typeof decoded.iat).toBe('number');
      expect(decoded.exp).toBeDefined();
      expect(typeof decoded.exp).toBe('number');
      expect(decoded.iss).toBeDefined();
      expect(typeof decoded.iss).toBe('string');
      expect(decoded.sub).toBeDefined();
      expect(typeof decoded.sub).toBe('string');
      expect(decoded.uid).toBeDefined();
      expect(typeof decoded.uid).toBe('string');
      expect(decoded.uid).toEqual(mockedAuth.uid);
    });
    it('Valid body, should return 201 and with decoded payload sent (under claims) ', async () => {
      const res = await request(app.getHttpServer())
        .post(`${CUSTOM_TOKEN_GPI}`)
        .send({
          uid: mockedAuth.uid,
          signPayload: TEST_USER_PAYLOAD,
        });
      const decoded = jwt.decode(res.body.signInToken) as jwt.JwtPayload;
      expect(res.status).toEqual(201);
      expect(res.body.signInToken).toBeDefined();
      // * Decoded signInToken structure test
      expect(decoded.claims).toBeDefined();
      expect(JSON.stringify(decoded.claims)).toEqual(
        JSON.stringify(TEST_USER_PAYLOAD),
      );
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuth.uid);
    });
  });
  describe(`[POST] ${TOKEN_SIGN_IN_GPI}`, () => {
    let mockedAuth: UserRecord;
    let mockSignInToken: string;
    const MOCK_AUTH_DATA = GetMockFirebaseAuthData('002');
    const TEST_USER_PAYLOAD = {
      testString: 'I am a string',
      testNumber: 1000,
      testBoolean: true,
      testArray: ['item1', 'item2', 'item3'],
    };
    beforeAll(async () => {
      // * Create to get uid
      mockedAuth = await FirebaseAdminAuth.createUser(MOCK_AUTH_DATA);
      mockSignInToken = await FirebaseAdminAuth.createCustomToken(
        mockedAuth.uid,
        TEST_USER_PAYLOAD,
      );
    });
    it('Empty body, should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${TOKEN_SIGN_IN_GPI}`)
        .expect(400);
    });
    it('Invalid signInToken, should throw 401', () => {
      return request(app.getHttpServer())
        .post(`${TOKEN_SIGN_IN_GPI}`)
        .send({
          signInToken: 'jwt.io',
        })
        .expect(401);
    });
    it('Valid signInToken, should return 201', async () => {
      const res = await request(app.getHttpServer())
        .post(`${TOKEN_SIGN_IN_GPI}`)
        .send({
          signInToken: mockSignInToken,
        });
      expect(res.status).toEqual(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.operationType).toBeDefined();
      expect(res.body._tokenResponse).toBeDefined();
      expect(res.body._tokenResponse.kind).toBeDefined();
      expect(res.body._tokenResponse.idToken).toBeDefined();
      expect(res.body._tokenResponse.refreshToken).toBeDefined();
      expect(res.body._tokenResponse.expiresIn).toBeDefined();
      expect(res.body._tokenResponse.isNewUser).toBeDefined();
      expect(res.body.user.uid).toEqual(mockedAuth.uid);
      expect(res.body.user.email).toEqual(mockedAuth.email);
      expect(res.body.user.displayName).toEqual(mockedAuth.displayName);
      expect(res.body.user.createdAt).toBeDefined();
      expect(res.body.user.lastLoginAt).toBeDefined();
      expect(res.body.user.apiKey).toBeDefined();
      expect(res.body.user.appName).toBeDefined();
      expect(res.body.user.providerData).toBeDefined();
      expect(res.body.user.stsTokenManager).toBeDefined();
      expect(res.body.user.stsTokenManager.refreshToken).toBeDefined();
      expect(res.body.user.stsTokenManager.accessToken).toBeDefined();
      expect(res.body.user.stsTokenManager.expirationTime).toBeDefined();
    });
    it('Valid signInToken, should return 201 and with user jwt', async () => {
      const res = await request(app.getHttpServer())
        .post(`${TOKEN_SIGN_IN_GPI}`)
        .send({
          signInToken: mockSignInToken,
        });
      expect(res.status).toEqual(201);
      const decodedIdToken = jwt.decode(
        res.body._tokenResponse.idToken,
      ) as jwt.JwtPayload;
      const decodedAccessToken = jwt.decode(
        res.body.user.stsTokenManager.accessToken,
      ) as jwt.JwtPayload;
      expect(decodedIdToken.name).toEqual(MOCK_AUTH_DATA.displayName);
      expect(decodedIdToken.picture).toEqual(MOCK_AUTH_DATA.photoURL);
      expect(decodedIdToken.email).toEqual(MOCK_AUTH_DATA.email);
      expect(decodedAccessToken.name).toEqual(MOCK_AUTH_DATA.displayName);
      expect(decodedAccessToken.picture).toEqual(MOCK_AUTH_DATA.photoURL);
      expect(decodedAccessToken.email).toEqual(MOCK_AUTH_DATA.email);
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuth.uid);
    });
  });
  describe(`[POST] ${EMAIL_SIGN_IN_GPI}`, () => {
    let mockedSignAuth01: UserRecord;
    const MOCK_AUTH_DATA_01 = GetMockFirebaseAuthData('003');
    let mockedSignAuth02: UserRecord;
    const MOCK_AUTH_DATA_02 = GetMockFirebaseAuthData('004');
    it('Empty body, should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({})
        .expect(400);
    });
    it('Invalid email (string), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: 'invalid',
          password: '123456',
        })
        .expect(400);
    });
    it('Invalid email (number), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: 10001584,
          password: '123456',
        })
        .expect(400);
    });
    it('Invalid email (boolean), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: true,
          password: '123456',
        })
        .expect(400);
    });
    it('Invalid password length (5), should throw 400', () => {
      return request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: 'jester@gmail.com',
          password: '12345',
        })
        .expect(400);
    });
    it('Email not verified, still can succeed', async () => {
      // * Setup User
      await FirebaseAdminAuth.createUser({
        email: MOCK_AUTH_DATA_01.email,
        password: MOCK_AUTH_DATA_01.password,
        displayName: MOCK_AUTH_DATA_01.displayName,
        emailVerified: false,
        disabled: false,
      });
      mockedSignAuth01 = await FirebaseAdminAuth.getUserByEmail(
        MOCK_AUTH_DATA_01.email,
      );
      const res = await request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: MOCK_AUTH_DATA_01.email,
          password: MOCK_AUTH_DATA_01.password,
        });
      expect(res.status).toEqual(201);
    });
    it('Valid setup, should return 201', async () => {
      // * Setup User
      await FirebaseAdminAuth.createUser({
        email: MOCK_AUTH_DATA_02.email,
        password: MOCK_AUTH_DATA_02.password,
        displayName: MOCK_AUTH_DATA_02.displayName,
        emailVerified: false,
        disabled: false,
      });
      mockedSignAuth02 = await FirebaseAdminAuth.getUserByEmail(
        MOCK_AUTH_DATA_02.email,
      );
      const res = await request(app.getHttpServer())
        .post(`${EMAIL_SIGN_IN_GPI}`)
        .send({
          email: MOCK_AUTH_DATA_02.email,
          password: MOCK_AUTH_DATA_02.password,
        });
      expect(res.status).toEqual(201);
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedSignAuth01.uid);
      await FirebaseAdminAuth.deleteUser(mockedSignAuth02.uid);
    });
  });
  describe(`[GET] ${ID_TOKEN_VALIDATION_GPI}`, () => {
    let mockedAuth: UserRecord;
    let mockSignInToken: string;
    let mockedTokenRes: UserCredential;
    let validIdToken: string;
    const invalidIdToken =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjBkMGU4NmJkNjQ3NDBjYWQyNDc1NjI4ZGEyZWM0OTZkZjUyYWRiNWQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSm9lIExlZSIsInJvbGUiOiJhZG1pbiIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9uZXN0anMtc3RhcnRlci04YWQ4NSIsImF1ZCI6Im5lc3Rqcy1zdGFydGVyLThhZDg1IiwiYXV0aF90aW1lIjoxNjk4ODU4ODE5LCJ1c2VyX2lkIjoiTXc0WXRGSzRZbVZrOHVHVGtKQzIxdDZmM21tMSIsInN1YiI6Ik13NFl0Rks0WW1Wazh1R1RrSkMyMXQ2ZjNtbTEiLCJpYXQiOjE2OTg4NTg4MTksImV4cCI6MTY5ODg2MjQxOSwiZW1haWwiOiJrYXJvY2tzam9lbGVlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJrYXJvY2tzam9lbGVlQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6ImN1c3RvbSJ9fQ.PHw1v3BEy1ob3nMPJskFwfaFriG9u-m5ygXQ5A2fj1pe-wBH21NUmVYynFeNA7eF5xISjoEtlLe9gCnk4M_Z1NQKCuPUROrm305voQ6tQXZWm8DWbfzWj-JX2pUIBVV7TeL3gGd68mOcg2sdpkDvm8B_chS1uo210teWYoETRCXk6ah8EU3fRqH80K8RuRwos1WIhvKdf06dmF39zeaqxi77HDG-1lEFW3vssjgm30Wc2FCmVah8R0_-kkTOukQj4Ebqqbx7i2WMq5TvwD3fA2xtk0yWm4l2IYSzVDRkkmr-UUyBOxlROTURWIoKkJkp6V8Omgnhi9WASbNXpWDWOw';
    const MOCK_AUTH_DATA = GetMockFirebaseAuthData('005');
    const TEST_USER_PAYLOAD = {
      testString: 'I am a string',
      testNumber: 1000,
      testBoolean: true,
      testArray: ['item1', 'item2', 'item3'],
    };
    beforeAll(async () => {
      // * Create to get uid
      mockedAuth = await FirebaseAdminAuth.createUser(MOCK_AUTH_DATA);
      mockSignInToken = await FirebaseAdminAuth.createCustomToken(
        mockedAuth.uid,
        TEST_USER_PAYLOAD,
      );
      mockedTokenRes = await signInWithCustomToken(
        FirebaseAuth,
        mockSignInToken,
      );
      validIdToken = await mockedTokenRes.user.getIdToken();
    });
    it('Invalid token (123), should return 401', () => {
      return request(app.getHttpServer())
        .get(`${ID_TOKEN_VALIDATION_GPI}/123`)
        .expect(401);
    });
    it('Expired token, should return 401', () => {
      return request(app.getHttpServer())
        .get(`${ID_TOKEN_VALIDATION_GPI}/${invalidIdToken}`)
        .expect(401);
    });
    it('Validated token, should return 200', async () => {
      const res = await request(app.getHttpServer()).get(
        `${ID_TOKEN_VALIDATION_GPI}/${validIdToken}`,
      );
      expect(res.status).toEqual(200);
      expect(res.body.name).toBeDefined();
      expect(res.body.name).toEqual(MOCK_AUTH_DATA.displayName);
      expect(res.body.iss).toBeDefined();
      expect(typeof res.body.iss).toBe('string');
      expect(res.body.aud).toBeDefined();
      expect(typeof res.body.aud).toBe('string');
      expect(res.body.auth_time).toBeDefined();
      expect(typeof res.body.auth_time).toBe('number');
      expect(res.body.user_id).toBeDefined();
      expect(res.body.user_id).toEqual(mockedAuth.uid);
      expect(res.body.sub).toBeDefined();
      expect(res.body.sub).toEqual(mockedAuth.uid);
      expect(res.body.iat).toBeDefined();
      expect(typeof res.body.iat).toBe('number');
      expect(res.body.exp).toBeDefined();
      expect(typeof res.body.exp).toBe('number');
      expect(res.body.email).toBeDefined();
      expect(res.body.email).toEqual(MOCK_AUTH_DATA.email);
      expect(res.body.email_verified).toBeDefined();
      expect(res.body.firebase).toBeDefined();
      expect(res.body.uid).toBeDefined();
      expect(res.body.uid).toEqual(mockedAuth.uid);
    }, 5000);
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuth.uid);
    });
  });
  describe(`[DELETE] ${USER_TOKEN_SIGN_IN_GPI}`, () => {
    const MOCK_AUTH_DATA = GetMockFirebaseAuthData('006');
    const TEST_USER_PAYLOAD = {
      testString: 'I am a string',
      testNumber: 1000,
      testBoolean: true,
      testArray: ['item1', 'item2', 'item3'],
    };
    let mockedAuth: UserRecord;
    let mockSignInToken: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let mockedTokenRes: UserCredential;
    beforeAll(async () => {
      // * Create to get uid
      mockedAuth = await FirebaseAdminAuth.createUser(MOCK_AUTH_DATA);
      mockSignInToken = await FirebaseAdminAuth.createCustomToken(
        mockedAuth.uid,
        TEST_USER_PAYLOAD,
      );
      mockedTokenRes = await signInWithCustomToken(
        FirebaseAuth,
        mockSignInToken,
      );
    });
    it('Non-exist uid, should return 404', () => {
      return request(app.getHttpServer())
        .delete(`${USER_TOKEN_SIGN_IN_GPI}/123`)
        .expect(404);
    });
    it('Valid uid, should return 200', () => {
      return request(app.getHttpServer())
        .delete(`${USER_TOKEN_SIGN_IN_GPI}/${mockedAuth.uid}`)
        .expect(200);
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuth.uid);
    });
  });
});
