import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, UserStatus } from './schemas/user.schema';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from './users.exceptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocument>,
  ) {}

  async findAll(filter: FilterQuery<UserDocument> = {}) {
    return await this.usersModel.find(filter);
  }

  async findOne(filter: FilterQuery<UserDocument> = {}) {
    return await this.usersModel.findOne(filter);
  }

  async getById(id: string) {
    return await this.findOne({ id });
  }

  async getByEmail(email: string) {
    return await this.findOne({ email });
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.getByEmail(createUserDto.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(createUserDto.email);
    }

    const user = new this.usersModel(createUserDto);
    return await user.save();
  }

  async activate(email: string) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new UserNotFoundException(email);
    }

    user.status = UserStatus.ACTIVE;
    await user.save();

    return {
      success: true,
      message: 'User activated successfully',
    };
  }

  async disable(email: string) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new UserNotFoundException(email);
    }

    user.status = UserStatus.DISABLED;
    await user.save();

    return {
      success: true,
      message: 'User disabled successfully',
    };
  }
}
