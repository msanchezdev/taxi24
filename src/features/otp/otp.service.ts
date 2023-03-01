import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { User } from '../accounts/users/schemas/user.schema';
import { UserNotFoundException } from '../accounts/users/users.exceptions';
import { UsersService } from '../accounts/users/users.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpPurpose } from './otp.constants';
import {
  InvalidOtpCodeException,
  OtpCodeExpiredException,
} from './otp.exceptions';
import { OtpResolver } from './resolvers/types';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly usersService: UsersService,
  ) {}

  async requestOtp(request: RequestOtpDto) {
    const user = await this.usersService.getByEmail(request.user);
    if (!user) {
      this.logger.debug(`User not found: ${request.user}`);
      throw new UserNotFoundException(request.user);
    }

    this.logger.debug(`Generating OTP for user: ${user.email}`);
    user.otp = {
      purpose: request.purpose,
      code: generateOtp(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 5), // TODO: Make this configurable
    };
    user.id;
    await user.save();

    this.logger.debug(
      `Sending OTP to user: ${user.email} via ${request.delivery.method}${
        request.delivery.address
          ? ` using alternate address ${request.delivery.address}`
          : ``
      }`,
    );
    // TODO: Send OTP to user via email or SMS according to request.delivery

    return {
      purpose: user.otp.purpose,
      delivery: request.delivery,
      expiresAt: user.otp.expiresAt,
    };
  }

  async verifyOtp(verification: VerifyOtpDto) {
    const user = await this.usersService.getByEmail(verification.user);
    if (!user) {
      this.logger.debug(`User not found: ${verification.user}`);
      throw new UserNotFoundException(verification.user);
    }

    if (!user.otp) {
      this.logger.debug(`OTP not found for user: ${verification.user}`);
      throw new InvalidOtpCodeException('not_found');
    }

    this.logger.debug(
      `Verifying OTP for user: ${verification.user}, code: ${verification.code}, purpose: ${verification.purpose}`,
    );
    if (user.otp.purpose !== verification.purpose) {
      this.logger.debug(
        `OTP purpose mismatch for user: ${verification.user}, received: ${verification.purpose}, expected: ${user.otp.purpose}`,
      );
      throw new InvalidOtpCodeException('purpose_mismatch');
    }

    if (user.otp.expiresAt < new Date()) {
      this.logger.debug(
        `OTP expired for user: ${verification.user}, expiresAt: ${+user.otp
          .expiresAt}, now: ${+new Date()}`,
      );
      throw new OtpCodeExpiredException();
    }

    if (user.otp.code !== verification.code) {
      this.logger.debug(
        `OTP code mismatch for user: ${verification.user}, received: ${verification.code}, expected: ${user.otp.code}`,
      );
      throw new InvalidOtpCodeException('code_mismatch');
    }

    this.logger.debug(`OTP verified for user: ${verification.user}`);
    user.otp = null;
    await user.save();

    return this.resolvePurpose(verification.purpose, user);
  }

  async resolvePurpose(purpose: OtpPurpose, user: User) {
    try {
      const resolver = this.moduleRef.get<OtpResolver>(purpose, {
        strict: false,
      });

      return resolver.resolve(user);
    } catch (e) {
      if (e instanceof Error && e.name === 'UnknownElementException') {
        this.logger.error(`Resolver not found for purpose: ${purpose}`);
        throw new Error(`Resolver not found for purpose: ${purpose}`);
      }

      throw e;
    }
  }

  async __getOtpForUser(email: string) {
    const user = await this.usersService.getByEmail(email);
    if (!user) {
      this.logger.debug(`User not found: ${email}`);
      throw new UserNotFoundException(email);
    }

    return user.otp;
  }
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
