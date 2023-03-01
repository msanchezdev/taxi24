import { HttpStatus, INestApplication } from '@nestjs/common';
import mongoose from 'mongoose';
import * as request from 'supertest';
import { seed } from '~/utils/seed';
import { throws } from '~/utils/test/errors-with';
import { setupTestApplication } from '~/utils/test/setup-tests';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserStatus } from './schemas/user.schema';
import { UserAlreadyExistsException } from './users.exceptions';

describe('UsersController', () => {
  let app!: INestApplication;

  setupTestApplication((_app) => {
    app = _app;
  });

  describe('/ (GET)', () => {
    it('gets all users', async () => {
      const dbusers = await seed(app, User, [
        {
          id: '63fde645cf52222c059b533f',
          email: 'test1@taxi24.local',
          password: 'test',
          name: {
            given: 'Test',
            family: 'User',
          },
          permissions: [],
          status: UserStatus.ACTIVE,
          tenant: null,
        },
        {
          id: '63fde94ecf52222c059b5340',
          email: 'test2@taxi24.local',
          password: 'test',
          name: {
            given: 'Test',
            family: 'User',
          },
          permissions: [],
          status: UserStatus.ACTIVE,
          tenant: null,
        },
      ]);

      return request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.OK)
        .expect(({ body }: { body: User[] }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body).toHaveLength(2);
          expect(
            body.every((user) =>
              dbusers.find((dbuser) => dbuser.id === user.id),
            ),
          );
        });
    });
  });

  describe('/ (POST)', () => {
    const fixture: CreateUserDto = {
      email: 'test1@taxi24.local',
      password: 'Welc0me.',
      name: {
        given: 'Test',
        family: 'User',
      },
    };

    it('creates a new user', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(fixture)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.email).toEqual('test1@taxi24.local');
        });
    });

    it('fails if email is already in use', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(fixture)
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .post('/users')
        .send(fixture)
        .expect(throws(UserAlreadyExistsException));
    });
  });

  describe('/:id (GET)', () => {
    it('gets a user by id', () => {
      return request(app.getHttpServer())
        .get('/users/1')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.id).toEqual('1');
        });
    });
  });

  describe('/:id (PATCH)', () => {
    it('updates a user by id', () => {
      return request(app.getHttpServer())
        .patch('/users/1')
        .send({
          email: 'test2@taxi24.local',
        })
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body.email).toEqual('test2@taxi24.local');
        });
    });
  });

  describe('/:id (DELETE)', () => {
    it('deletes a user by id', () => {
      return request(app.getHttpServer())
        .delete('/users/1')
        .expect(HttpStatus.OK)
        .expect(({ body }) => {
          expect(body).toBeInstanceOf(Object);
          expect(Object.keys(body)).toHaveLength(0);
        });
    });
  });
});
