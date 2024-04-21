import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { FirebaseModule } from '@gdk/firebase/firebase.module';
import { FirebaseAuthController } from '@gdk/firebase/firebase-auth/firebase-auth.controller';
import { FirebaseAuthService } from '@gdk/firebase/firebase-auth/firebase-auth.service';
import { FirebaseAdminAuth } from '@vendors/firebase/firebase-admin-app';
import {
  DISABLE_PATH,
  EMAIL_PATH,
  EMAIL_VERIFIED_PATH,
  FIREBASE_AUTH_API,
  GPI,
  LIST_PATH,
  VER_1,
} from '@shared/types/gdk';

import { GetMockFirebaseAuthData } from './mock-auth-data-helper';

describe('Firebase Auth GPIs - CRUD', () => {
  let app: INestApplication;
  const GPI_PATH = `/${GPI}/${FIREBASE_AUTH_API}`;
  const AUTH_PATH = `${GPI_PATH}/${VER_1}`;
  const LIST_AUTH_API = `${AUTH_PATH}/${LIST_PATH}`;
  const EMAIL_AUTH_API = `${AUTH_PATH}/${EMAIL_PATH}`;
  const EMAIL_VERIFIED_API = `${AUTH_PATH}/${EMAIL_VERIFIED_PATH}`;
  const DISABLE_API = `${AUTH_PATH}/${DISABLE_PATH}`;

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

  describe(`[POST] ${AUTH_PATH}`, () => {
    const MOCK_AUTH_DATA = GetMockFirebaseAuthData('01');
    let mockedAuth: UserRecord;
    let mockedAuth2: UserRecord;
    it(`Empty Body, should throw 400`, () => {
      return request(app.getHttpServer()).post(`${AUTH_PATH}`).expect(400);
    });
    it(`Invalid email （"jest"), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${AUTH_PATH}`)
        .send({
          ...MOCK_AUTH_DATA,
          email: 'jest',
        })
        .expect((res) => {
          mockedAuth = res.body;
          return res;
        })
        .expect(400);
    });
    it(`Invalid password (string less than 6), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${AUTH_PATH}`)
        .send({
          ...MOCK_AUTH_DATA,
          password: '1',
        })
        .expect((res) => {
          mockedAuth = res.body;
          return res;
        })
        .expect(400);
    });
    it(`Invalid password (boolean), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${AUTH_PATH}`)
        .send({
          ...MOCK_AUTH_DATA,
          password: true,
        })
        .expect((res) => {
          mockedAuth = res.body;
          return res;
        })
        .expect(400);
    });
    it(`Invalid password (number), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${AUTH_PATH}`)
        .send({
          ...MOCK_AUTH_DATA,
          password: 123,
        })
        .expect((res) => {
          mockedAuth = res.body;
          return res;
        })
        .expect(400);
    });
    it(`Invalid displayName (boolean), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${AUTH_PATH}`)
        .send({
          ...MOCK_AUTH_DATA,
          displayName: true,
        })
        .expect((res) => {
          mockedAuth = res.body;
          return res;
        })
        .expect(400);
    });
    it(`Invalid displayName (number), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${AUTH_PATH}`)
        .send({
          ...MOCK_AUTH_DATA,
          displayName: 123,
        })
        .expect((res) => {
          mockedAuth = res.body;
          return res;
        })
        .expect(400);
    });
    it(`Invalid displayName (empty string), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${AUTH_PATH}`)
        .send({
          ...MOCK_AUTH_DATA,
          displayName: '',
        })
        .expect((res) => {
          mockedAuth = res.body;
          return res;
        })
        .expect(400);
    });
    it(`Invalid photoURL (not url), should throw 400`, () => {
      return request(app.getHttpServer())
        .post(`${AUTH_PATH}`)
        .send({
          ...MOCK_AUTH_DATA,
          photoURL: 'imagenameorfilename',
        })
        .expect((res) => {
          mockedAuth = res.body;
          return res;
        })
        .expect(400);
    });
    it(`Should create new Auth with valid Mock Auth data`, () => {
      return request(app.getHttpServer())
        .post(`${AUTH_PATH}`)
        .send(MOCK_AUTH_DATA)
        .expect((res) => {
          mockedAuth = res.body;
          return res;
        })
        .expect(201);
    });
    it(`Should create new Auth with valid Mock Auth data (photoUrl is empty string)`, () => {
      const MOCK_AUTH_DATA = GetMockFirebaseAuthData('04');
      return request(app.getHttpServer())
        .post(`${AUTH_PATH}`)
        .send({
          ...MOCK_AUTH_DATA,
          photoURL: '',
        })
        .expect((res) => {
          mockedAuth2 = res.body;
          return res;
        })
        .expect(201);
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuth.uid);
      await FirebaseAdminAuth.deleteUser(mockedAuth2.uid);
    });
  });

  describe(`[GET] ${LIST_AUTH_API}`, () => {
    it(`Should return list of Auth`, () => {
      return request(app.getHttpServer()).get(`${LIST_AUTH_API}`).expect(200);
    });
  });

  describe(`[GET] ${AUTH_PATH}/:uid`, () => {
    let mockedAuth: UserRecord;
    const MOCK_AUTH_DATA = GetMockFirebaseAuthData('02');
    beforeAll(async () => {
      // * Create to get uid
      mockedAuth = await FirebaseAdminAuth.createUser(MOCK_AUTH_DATA);
    });
    it(`Invalid uid, should throw 404`, () => {
      return request(app.getHttpServer())
        .get(`${AUTH_PATH}/abc123`)
        .expect(404);
    });
    it(`Should return Auth by uid:`, () => {
      return request(app.getHttpServer())
        .get(`${AUTH_PATH}/${mockedAuth.uid}`)
        .expect(200);
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuth.uid);
    });
  });

  describe(`[GET] ${EMAIL_AUTH_API}/:email`, () => {
    let mockedAuth: UserRecord;
    const MOCK_AUTH_DATA = GetMockFirebaseAuthData('03');
    beforeAll(async () => {
      // * Create to get email
      mockedAuth = await FirebaseAdminAuth.createUser(MOCK_AUTH_DATA);
    });
    it(`Not created email: noexist@evolabs.io, should throw 404`, () => {
      return request(app.getHttpServer())
        .get(`${EMAIL_AUTH_API}/noexist@evolabs.io`)
        .expect(404);
    });
    it(`Should return Auth by email:`, () => {
      return request(app.getHttpServer())
        .get(`${EMAIL_AUTH_API}/${MOCK_AUTH_DATA.email}`)
        .expect(200);
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuth.uid);
    });
  });

  describe(`[PUT] ${AUTH_PATH}/:uid`, () => {
    let mockedAuth: UserRecord;
    const MOCK_AUTH_DATA = GetMockFirebaseAuthData('05');
    beforeAll(async () => {
      // * Create to get uid
      mockedAuth = await FirebaseAdminAuth.createUser(MOCK_AUTH_DATA);
    });
    it('Not created Auth uid (12345), should throw 404', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/12345`)
        .send(MOCK_AUTH_DATA)
        .expect(404);
    });
    it('Empty body, should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({})
        .expect(400);
    });
    it('Intend to update invalid Email should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          email: 'invalid-email',
        })
        .expect(400);
    });
    it('Intend to update invalid Email (number) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          email: 1000,
        })
        .expect(400);
    });
    it('Intend to update invalid Email (boolean) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          email: false,
        })
        .expect(400);
    });
    it('Intend to update invalid Password (less than 6) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          password: 'pass',
        })
        .expect(400);
    });
    it('Intend to update invalid Password (number) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          password: 1000,
        })
        .expect(400);
    });
    it('Intend to update invalid Password (boolean) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          password: true,
        })
        .expect(400);
    });
    it('Intend to update invalid displayName (empty string) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          displayName: '',
        })
        .expect(400);
    });
    it('Intend to update invalid displayName (number) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          displayName: 1200,
        })
        .expect(400);
    });
    it('Intend to update invalid displayName (boolean) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          displayName: true,
        })
        .expect(400);
    });
    it('Intend to update invalid emailVerified (string) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          emailVerified: 'true',
        })
        .expect(400);
    });
    it('Intend to update invalid emailVerified (number) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          emailVerified: 0,
        })
        .expect(400);
    });
    it('Intend to update invalid photoURL (not url) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          photoURL: 'imagefilename',
        })
        .expect(400);
    });
    it('Intend to update invalid disabled (string) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          emailVerified: 'true',
        })
        .expect(400);
    });
    it('Intend to update invalid disabled (number) should throw 400', () => {
      return request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          emailVerified: 100,
        })
        .expect(400);
    });
    it('Update email by uid, email should change', async () => {
      const intendUpdateEmail = 'jest06updated@evolab.io';
      const res = await request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          email: intendUpdateEmail,
        });
      expect(res.status).toEqual(200);
      expect(res.body.email).toEqual(intendUpdateEmail);
      expect(res.body.uid).toEqual(mockedAuth.uid);
    });
    it('Update displayName by uid, displayName should change', async () => {
      const intendUpdateDisplayName = 'jest06_updated';
      const res = await request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          displayName: intendUpdateDisplayName,
        });
      expect(res.status).toEqual(200);
      expect(res.body.displayName).toEqual(intendUpdateDisplayName);
      expect(res.body.uid).toEqual(mockedAuth.uid);
    });
    it('Update password by uid, should succeed', async () => {
      const intendUpdatePassword = 'jest654321_pwdupdated';
      const res = await request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          password: intendUpdatePassword,
        });
      expect(res.status).toEqual(200);
      expect(res.body.uid).toEqual(mockedAuth.uid);
    });
    it('Update photoURL by uid, photoURL should changed', async () => {
      const intendUpdatePhotoURL =
        'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png';
      const res = await request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          photoURL: intendUpdatePhotoURL,
        });
      expect(res.status).toEqual(200);
      expect(res.body.photoURL).toEqual(intendUpdatePhotoURL);
      expect(res.body.uid).toEqual(mockedAuth.uid);
    });
    it('Update emailVerified to true by uid, emailVerified should changed to true', async () => {
      const res = await request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          emailVerified: true,
        });
      expect(res.status).toEqual(200);
      expect(res.body.emailVerified).toEqual(true);
      expect(res.body.uid).toEqual(mockedAuth.uid);
    });
    it('Update emailVerified to true by uid, emailVerified should changed to true', async () => {
      const res = await request(app.getHttpServer())
        .put(`${AUTH_PATH}/${mockedAuth.uid}`)
        .send({
          ...MOCK_AUTH_DATA,
          disabled: true,
        });
      expect(res.status).toEqual(200);
      expect(res.body.disabled).toEqual(true);
      expect(res.body.uid).toEqual(mockedAuth.uid);
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuth.uid);
    });
  });

  describe(`[PUT] ${EMAIL_VERIFIED_API}/:uid`, () => {
    let mockedAuth: UserRecord;
    const MOCK_AUTH_DATA = GetMockFirebaseAuthData('06');
    beforeAll(async () => {
      // * Create to get uid
      mockedAuth = await FirebaseAdminAuth.createUser(MOCK_AUTH_DATA);
    });
    it(`Invalid uid, should return 404`, () => {
      return request(app.getHttpServer())
        .put(`${EMAIL_VERIFIED_API}/1234`)
        .expect(404);
    });
    it(`Should set emailVerified to true`, async () => {
      const res = await request(app.getHttpServer()).put(
        `${EMAIL_VERIFIED_API}/${mockedAuth.uid}`,
      );
      expect(res.status).toEqual(200);
      expect(res.body.emailVerified).toEqual(true);
      expect(res.body.uid).toEqual(mockedAuth.uid);
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuth.uid);
    });
  });

  describe(`[PUT] ${DISABLE_API}/:uid`, () => {
    let mockedAuth: UserRecord;
    const MOCK_AUTH_DATA = GetMockFirebaseAuthData('07');
    beforeAll(async () => {
      // * Create to get uid
      mockedAuth = await FirebaseAdminAuth.createUser(MOCK_AUTH_DATA);
    });
    it(`Invalid uid, should return 404`, () => {
      return request(app.getHttpServer())
        .put(`${DISABLE_API}/1234`)
        .expect(404);
    });
    it(`Should set disabled to true`, async () => {
      const res = await request(app.getHttpServer()).put(
        `${DISABLE_API}/${mockedAuth.uid}`,
      );
      expect(res.status).toEqual(200);
      expect(res.body.disabled).toEqual(true);
      expect(res.body.uid).toEqual(mockedAuth.uid);
    });
    afterAll(async () => {
      await FirebaseAdminAuth.deleteUser(mockedAuth.uid);
    });
  });

  describe(`[DELETE] ${AUTH_PATH}/:id`, () => {
    let mockedAuth: UserRecord;
    const MOCK_AUTH_DATA = GetMockFirebaseAuthData('08');
    beforeAll(async () => {
      // * Create to get uid
      mockedAuth = await FirebaseAdminAuth.createUser(MOCK_AUTH_DATA);
    });
    it('Invalid uid, should return 404', () => {
      return request(app.getHttpServer())
        .delete(`${AUTH_PATH}/1234`)
        .expect(404);
    });
    it('Should delete by uid', () => {
      return request(app.getHttpServer())
        .delete(`${AUTH_PATH}/${mockedAuth.uid}`)
        .expect(200);
    });
  });

  describe(`[DELETE] ${AUTH_PATH}`, () => {
    const mockedAuthList: UserRecord[] = [];
    const uidStringList: string[] = [];
    const MOCK_AUTH_DATA = GetMockFirebaseAuthData('09');
    const MOCK_AUTH_DATA_2 = GetMockFirebaseAuthData('10');
    beforeAll(async () => {
      // * Create to get uid
      const auth1 = await FirebaseAdminAuth.createUser(MOCK_AUTH_DATA);
      const auth2 = await FirebaseAdminAuth.createUser(MOCK_AUTH_DATA_2);
      mockedAuthList.push(auth1);
      mockedAuthList.push(auth2);
      uidStringList.push(`${auth1.uid}`);
      uidStringList.push(`${auth2.uid}`);
    });
    it('Empty uid list, should return 400', () => {
      return request(app.getHttpServer()).delete(`${AUTH_PATH}`).expect(400);
    });
    it('Invalid uid list (json), should return 400', () => {
      return request(app.getHttpServer())
        .delete(`${AUTH_PATH}`)
        .query({
          uidList: uidStringList,
        })
        .expect(400);
    });
    it('Should delete by uid list by passing to query', async () => {
      const res = await request(app.getHttpServer())
        .delete(`${AUTH_PATH}`)
        .query({
          uidList: uidStringList.join(','),
        });
      expect(res.status).toEqual(200);
      expect(res.body.failureCount).toEqual(0);
      expect(res.body.successCount).toEqual(2);
      expect(res.body.errors.length).toEqual(0);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
