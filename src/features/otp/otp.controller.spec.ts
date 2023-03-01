import { HttpStatus, INestApplication } from '@nestjs/common';
import { setupTestApplication } from '~/utils/test/setup-tests';
import * as request from 'supertest';
import {
  InvalidOtpCodeException,
  OtpCodeExpiredException,
} from './otp.exceptions';
import { RequestOtpDto } from './dto/request-otp.dto';
import { User, UserStatus } from '../accounts/users/schemas/user.schema';
import { VerifyOtpDto } from './dto/verify-otp.dto';

describe('OtpController', () => {
  let app: INestApplication;

  setupTestApplication(
    async (_app) => {
      app = _app;
    },
    {
      seed: [
        {
          type: User,
          records: [
            {
              email: 'test1@taxi24.local',
              tenant: null,
              name: {
                given: 'One',
                family: 'Test',
              },
              permissions: [],
              status: UserStatus.ACTIVE,
              password: 'test1',

              otp: {
                purpose: 'user-registration',
                code: '123456',
                expiresAt: new Date(Date.now() + 1000 * 60 * 5),
              },
            },

            {
              email: 'test2@taxi24.local',
              tenant: null,
              name: {
                given: 'Two',
                family: 'Test',
              },
              permissions: [],
              status: UserStatus.ACTIVE,
              password: 'test2',

              otp: {
                purpose: 'user-registration',
                code: '123456',
                expiresAt: new Date(Date.now() - 1000 * 60 * 5),
              },
            },
          ],
        },
      ],
    },
  );

  describe('/request (POST)', () => {
    const fixture: RequestOtpDto = {
      user: 'test1@taxi24.local',
      purpose: 'user-registration',
      delivery: {
        method: 'email',
      },
    };

    it('requests a new OTP code', () => {
      return request(app.getHttpServer())
        .post('/otp/request')
        .send(fixture)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.purpose).toEqual('user-registration');
          expect(body.delivery.method).toEqual('email');
          expect(body).toHaveProperty('expiresAt');
        });
    });
  });

  describe('/verify (POST)', () => {
    const fixture: VerifyOtpDto = {
      user: 'test1@taxi24.local',
      purpose: 'user-registration',
      code: '123456',
    };

    it('verifies an OTP code', () => {
      return request(app.getHttpServer())
        .post('/otp/verify')
        .send(fixture)
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.success).toEqual(true);
        });
    });

    it('fails if OTP code is invalid', () => {
      return request(app.getHttpServer())
        .post('/otp/verify')
        .send({
          ...fixture,
          code: '654321',
        })
        .expect(InvalidOtpCodeException.status)
        .expect(({ body }) => {
          expect(body.code).toEqual(InvalidOtpCodeException.code);
        });
    });

    it('fails if OTP code is expired', () => {
      return request(app.getHttpServer())
        .post('/otp/verify')
        .send({
          ...fixture,
          user: 'test2@taxi24.local',
          code: '654321',
        })
        .expect(OtpCodeExpiredException.status)
        .expect(({ body }) => {
          expect(body.code).toEqual(OtpCodeExpiredException.code);
        });
    });
  });
});
