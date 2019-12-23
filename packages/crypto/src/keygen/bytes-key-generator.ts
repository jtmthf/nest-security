import { MaybePromise } from '@nestjs-security/utils';

export interface BytesKeyGenerator {
  /**
   * Get the length, in bytes, of keys created by this generator. Most unique
   * keys are at least 8 bytes in length.
   */
  readonly keyLength: number;

  /**
   * Generate a new key.
   */
  generateKey(): MaybePromise<Buffer>;
}
