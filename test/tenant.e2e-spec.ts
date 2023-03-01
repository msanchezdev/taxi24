import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApplication } from '~/utils/setup-tests';
import {
  NoOrganizationSpecifiedException,
  OrganizationNotFoundException,
} from '~/features/accounts/organization/tenant.exceptions';

describe('TenantController (e2e)', () => {
  let app: INestApplication;

  setupTestApplication((_app) => {
    app = _app;
  });

  it('/tenant (GET) : fails if no tenant specified', () => {
    return request(app.getHttpServer())
      .get('/tenant')
      .expect(NoOrganizationSpecifiedException.status)
      .expect(({ body }) => {
        expect(body.code).toEqual(NoOrganizationSpecifiedException.code);
      });
  });

  it('/tenant (GET) : succeeds if tenant specified', () => {
    return request(app.getHttpServer())
      .get('/tenant')
      .set('X-Tenant', 'test')
      .expect(OrganizationNotFoundException.status)
      .expect(({ body }) => {
        expect(body.code).toEqual(OrganizationNotFoundException.code);
      });
  });
});
