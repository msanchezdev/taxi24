import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

const Models = MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },
]);

@Module({
  imports: [Models],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [Models, UsersService],
})
export class UsersModule {}
