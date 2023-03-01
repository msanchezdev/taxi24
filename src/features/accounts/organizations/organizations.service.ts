import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import {
  InvalidOrganizationIdException,
  OrganizationAlreadyExistsException,
} from './organizations.exceptions';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    @InjectModel(Organization.name)
    private readonly organizationsModel: Model<OrganizationDocument>,
  ) {}

  async getById(id: string) {
    this.logger.debug(`Getting orgnaization: ${id}`);
    return await this.organizationsModel.findOne({
      id,
    });
  }

  async create(dto: CreateOrganizationDto) {
    // name must only contain lowercase letters, numbers, hyphens, and underscores
    // and must start with a letter or number, and have between 3 and 60 characters
    const nameRegex = /^[a-z0-9][a-z0-9-_]{2,59}$/;
    if (!nameRegex.test(dto.id)) {
      this.logger.error(`Invalid organization name: ${dto.id}`);
      throw new InvalidOrganizationIdException(dto.id);
    }

    const existingTenant = await this.getById(dto.id);
    if (existingTenant) {
      this.logger.error(`Orgnaization already exists: ${dto.id}`);
      throw new OrganizationAlreadyExistsException(dto.id);
    } else {
      this.logger.debug(`Orgnaization does not exist, creating: ${dto.id}`);
    }

    const tenant = new this.organizationsModel(dto);
    return await tenant.save();
  }
}
