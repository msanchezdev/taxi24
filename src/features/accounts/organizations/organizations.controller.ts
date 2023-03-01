import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CurrentTenantName } from './decorators/tenant.decorator';
import { OrganizationsService } from './organizations.service';
import {
  OrganizationNotFoundException,
  NoOrganizationSpecifiedException,
} from './organizations.exceptions';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async getTenantInfo(@CurrentTenantName() tenantName: string) {
    if (!tenantName) {
      throw new NoOrganizationSpecifiedException();
    }

    const tenant = await this.organizationsService.getById(tenantName);
    if (!tenant) {
      throw new OrganizationNotFoundException(tenantName);
    }

    return tenant;
  }

  @Get(':tenantName')
  async getTenantInfoByName(@Param('tenantName') tenantName: string) {
    if (!tenantName) {
      throw new NoOrganizationSpecifiedException();
    }

    const tenant = await this.organizationsService.getById(tenantName);
    if (!tenant) {
      throw new OrganizationNotFoundException(tenantName);
    }

    return tenant;
  }

  @Post()
  async create(@Body() tenantDto: CreateOrganizationDto) {
    const createdTenant = await this.organizationsService.create(tenantDto);
    return createdTenant;
  }
}
