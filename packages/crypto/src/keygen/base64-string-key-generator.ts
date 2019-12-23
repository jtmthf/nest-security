import { StringKeyGenerator } from './string-key-generator';
import { BytesKeyGenerator } from './bytes-key-generator';
import { randomKeyGenerator } from './key-generators';

export class Base64StringKeyGenerator implements StringKeyGenerator {
  private static readonly DEFAULT_KEY_LENGTH = 32;
  private readonly keyGenerator: BytesKeyGenerator;

  constructor(keyLength = Base64StringKeyGenerator.DEFAULT_KEY_LENGTH) {
    if (keyLength < Base64StringKeyGenerator.DEFAULT_KEY_LENGTH) {
      throw new Error(
        `keyLength must be greater than or equal to ${Base64StringKeyGenerator.DEFAULT_KEY_LENGTH}`,
      );
    }
    this.keyGenerator = randomKeyGenerator(keyLength);
  }

  async generateKey(): Promise<string> {
    const key = await this.keyGenerator.generateKey();
    return key.toString('base64');
  }
}
