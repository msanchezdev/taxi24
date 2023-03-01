import 'mongoose-hidden';

declare module 'mongoose-hidden' {
  interface MongooseHiddenOptions {
    hidden?: Record<string, boolean>;
    defaultHidden?: Record<string, boolean>;
  }

  function mongooseHidden(
    options?: MongooseHiddenOptions,
  ): (schema: any, options?: any) => void;
  export = mongooseHidden;
}

// Update Mongoose SchemaTypeOptions

import { SchemaTypeOptions } from 'mongoose';
declare module 'mongoose' {
  interface SchemaTypeOptions<T> {
    hide?: boolean;
    hideJSON?: boolean;
    hideObject?: boolean;
  }
}
