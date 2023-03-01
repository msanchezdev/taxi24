import { Provider } from '@nestjs/common';
import { UserRegistrationResolver } from './user-registration.resolver';

export const otpResolvers = [UserRegistrationResolver].map(
  (resolver): Provider => ({
    provide: resolver.purpose,
    useClass: resolver,
  }),
);
