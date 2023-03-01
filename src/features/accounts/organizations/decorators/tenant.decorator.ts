import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { isIP } from 'net';
import { NoOrganizationSpecifiedException } from '../organizations.exceptions';

export const CurrentTenantName = createParamDecorator(
  (data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest() as Request;
    const tenantHeader = req.headers['x-tenant'];
    let tenantName = '';

    if (!tenantHeader) {
      const hostname = req.hostname;

      // if the hostname is an IP address, we can't get the tenant name
      if (isIP(hostname)) {
        throw new NoOrganizationSpecifiedException();
      }

      // We must only get the 3rd components of the hostname
      const hostnameComponents = req.hostname.split('.');
      if (hostnameComponents.length > 2) {
        tenantName = hostnameComponents.at(-3) || '';
      }
    } else {
      tenantName = Array.isArray(tenantHeader) ? tenantHeader[0] : tenantHeader;
    }

    if (!tenantName) {
      throw new NoOrganizationSpecifiedException();
    }

    return tenantName;
  },
);
