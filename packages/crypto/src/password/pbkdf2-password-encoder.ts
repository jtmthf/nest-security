import { PasswordEncoder } from './password-encoder';
import { BytesKeyGenerator, randomKeyGenerator } from '../keygen';
import { createHash, pbkdf2, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

export class Pbkdf2PasswordEncoder extends PasswordEncoder {
  private static readonly DEFAULT_HASH_WIDTH = 256;
  private static readonly DEFAULT_ITERATIONS = 185000;

  private readonly pbkdf2 = promisify(pbkdf2);
  private readonly saltGenerator: BytesKeyGenerator = randomKeyGenerator();
  private readonly secret: Buffer;
  private _algorithm = 'sha1';
  encodeHashAsBase64 = false;

  constructor(
    secret = '',
    private readonly iterations = Pbkdf2PasswordEncoder.DEFAULT_ITERATIONS,
    private readonly hashWidth = Pbkdf2PasswordEncoder.DEFAULT_HASH_WIDTH,
  ) {
    super();
    this.secret = Buffer.from(secret);
  }

  set algorithm(algorithm: string) {
    if (algorithm == null) {
      throw new Error('algorithm must be defined');
    }
    try {
      createHash(algorithm);
    } catch {
      throw new Error(`Invalid algorithm ${algorithm}`);
    }
    this._algorithm = algorithm;
  }

  async encode(rawPassword: string): Promise<string> {
    const salt = await this.saltGenerator.generateKey();
    const encoded = await this.encodeWithSalt(rawPassword, salt);
    return this.encodeBuffer(encoded);
  }

  async matches(
    rawPassword: string,
    encodedPassword: string,
  ): Promise<boolean> {
    const digested = this.decode(encodedPassword);
    const salt = Buffer.from(digested, 0, this.saltGenerator.keyLength);
    return timingSafeEqual(
      digested,
      await this.encodeWithSalt(rawPassword, salt),
    );
  }

  private encodeBuffer(bytes: Buffer): string {
    return bytes.toString(this.encodeHashAsBase64 ? 'base64' : 'hex');
  }

  private decode(encodedBytes: string): Buffer {
    return Buffer.from(
      encodedBytes,
      this.encodeHashAsBase64 ? 'base64' : 'hex',
    );
  }

  private async encodeWithSalt(
    rawPassword: string,
    salt: Buffer,
  ): Promise<Buffer> {
    const key = await this.pbkdf2(
      rawPassword,
      Buffer.concat([salt, this.secret], salt.length + this.secret.length),
      this.iterations,
      this.hashWidth,
      this._algorithm,
    );
    return Buffer.concat([salt, key], salt.length + key.length);
  }
}
