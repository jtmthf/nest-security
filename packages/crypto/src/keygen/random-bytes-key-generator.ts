import { randomBytes } from 'crypto';
import { promisify } from 'util';
import { BytesKeyGenerator } from './bytes-key-generator';

/**
 * @sealed
 */
export class RandomBytesKeyGenerator implements BytesKeyGenerator {
  private static readonly DEFAULT_KEY_LENGTH = 8;

  private readonly random: (size: number) => Promise<Buffer>;

  constructor(
    public readonly keyLength = RandomBytesKeyGenerator.DEFAULT_KEY_LENGTH,
  ) {
    this.random = promisify(randomBytes);
  }

  generateKey(): Promise<Buffer> {
    return this.random(this.keyLength);
  }
}
