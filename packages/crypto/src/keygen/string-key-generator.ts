import { MaybePromise } from '@nestjs-security/utils';

export interface StringKeyGenerator {
  generateKey(): MaybePromise<string>;
}
