import { HttpStatus, INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApplication } from '~/utils/test/setup-tests';
import {
  InvalidOrganizationIdException,
  NoOrganizationSpecifiedException,
  OrganizationAlreadyExistsException,
  OrganizationNotFoundException,
} from '../organizations/organizations.exceptions';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { throws } from '~/utils/test/errors-with';

describe('OrganizationsController', () => {
  let app: INestApplication;

  setupTestApplication((_app) => {
    app = _app;
  });

  // describe('/organizations (GET)', () => {
  //   it('fails if no  specified', () => {
  //     return request(app.getHttpServer())
  //       .get('/tenant')
  //       .expect(NoOrganizationSpecifiedException.status)
  //       .expect(({ body }) => {
  //         expect(body.code).toEqual(NoOrganizationSpecifiedException.code);
  //       });
  //   });

  //   it('fails if tenant specified but not found', () => {
  //     return request(app.getHttpServer())
  //       .get('/tenant')
  //       .set('X-Tenant', 'test')
  //       .expect(OrganizationNotFoundException.status)
  //       .expect(({ body }) => {
  //         expect(body.code).toEqual(OrganizationNotFoundException.code);
  //       });
  //   });

  //   it('succeeds if tenant specified and found', () => {
  //     return request(app.getHttpServer())
  //       .get('/tenant')
  //       .set('X-Tenant', 'test')
  //       .expect(HttpStatus.OK)
  //       .expect(({ body }) => {});
  //   });
  // });

  describe('/organizations (POST)', () => {
    const fixture: CreateOrganizationDto = {
      id: 'test1',
      name: 'First Testing Organization',
      description: 'This is the first testing organization',
    };

    it('creates a new organization', () => {
      return request(app.getHttpServer())
        .post('/organizations')
        .send(fixture)
        .expect(HttpStatus.CREATED)
        .expect(({ body }) => {
          expect(body.id).toEqual('test1');
          expect(body.name).toEqual('First Testing Organization');
          expect(body.description).toEqual(
            'This is the first testing organization',
          );
        });
    });

    it('fails if organization already exists', async () => {
      await request(app.getHttpServer())
        .post('/organizations')
        .send(fixture)
        .expect(HttpStatus.CREATED);

      return request(app.getHttpServer())
        .post('/organizations')
        .send(fixture)
        .expect(throws(OrganizationAlreadyExistsException));
    });

    it('fails if organization id is invalid', async () => {
      await request(app.getHttpServer())
        .post('/organizations')
        .send({
          ...fixture,
          id: 'test1!',
        } as CreateOrganizationDto)
        .expect(throws(InvalidOrganizationIdException));

      await request(app.getHttpServer())
        .post('/organizations')
        .send({
          ...fixture,
          id: 't',
        })
        .expect(throws(InvalidOrganizationIdException));

      await request(app.getHttpServer())
        .post('/organizations')
        .send({
          ...fixture,
          id: 'test1'.repeat(30),
        })
        .expect(throws(InvalidOrganizationIdException));
    });
  });
});
