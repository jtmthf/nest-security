import { promisify } from 'util';
import { scrypt, BinaryLike, ScryptOptions, timingSafeEqual } from 'crypto';
import { serialize, deserialize } from '@phc/format';
import ow from 'ow';
import { PasswordEncoder } from './password-encoder';
import { randomKeyGenerator, BytesKeyGenerator } from '../keygen';

interface SCryptPHCObject {
  id: 'scrypt';
  params: {
    N: number;
    r: number;
    p: number;
  };
  salt: Buffer;
  hash: Buffer;
}

const schema = ow.object.exactShape({
  id: ow.string.equals('scrypt'),
  params: ow.object.exactShape({
    N: ow.number.integer.greaterThan(1),
    r: ow.number.integer.greaterThanOrEqual(1),
    p: ow.number.integer.greaterThanOrEqual(1),
  }),
  salt: ow.buffer,
  hash: ow.buffer,
});

export class SCryptPasswordEncoder extends PasswordEncoder {
  private readonly saltGenerator: BytesKeyGenerator;
  private readonly scrypt = promisify<
    BinaryLike,
    BinaryLike,
    number,
    ScryptOptions,
    Buffer
  >(scrypt);

  constructor(
    private readonly cpuCost = 16384,
    private readonly memoryCost = 8,
    private readonly parallelization = 1,
    private readonly keyLength = 32,
    saltLength = 64,
  ) {
    super();
    if (cpuCost <= 1) {
      throw new Error('Cpu cost parameter must be > 1.');
    }
    if (memoryCost === 1 && cpuCost > 65536) {
      throw new Error('Cpu cost parameter must be > 1 and < 65536.');
    }
    if (memoryCost < 1) {
      throw new Error('Memory cost must be >= 1.');
    }
    const maxParallel = Number.MAX_SAFE_INTEGER / (128 * memoryCost * 8);
    if (parallelization < 1 || parallelization > maxParallel) {
      throw new Error(
        `Parallelisation parameter p must be >= 1 and <= ${maxParallel} (based on block size r of ${memoryCost})`,
      );
    }
    if (keyLength < 1 || keyLength > Number.MAX_SAFE_INTEGER) {
      throw new Error(
        'Key length must be >= 1 and <= ' + Number.MAX_SAFE_INTEGER,
      );
    }
    if (saltLength < 1 || saltLength > Number.MAX_SAFE_INTEGER) {
      throw new Error(
        'Salt length must be >= 1 and <= ' + Number.MAX_SAFE_INTEGER,
      );
    }

    this.saltGenerator = randomKeyGenerator(saltLength);
  }

  async encode(rawPassword: string): Promise<string> {
    return this.digest(rawPassword, await this.saltGenerator.generateKey());
  }

  async matches(
    rawPassword: string,
    encodedPassword: string,
  ): Promise<boolean> {
    if (encodedPassword == null || encodedPassword.length < this.keyLength) {
      console.warn('Empty encoded password');
      return false;
    }
    return this.decodeAndCheckMatches(rawPassword, encodedPassword);
  }

  upgradeEncoding(encodedPassword: string): boolean {
    if (!encodedPassword) {
      return false;
    }

    const options = deserialize(encodedPassword);
    ow(options, schema);
    const {
      params: { N: cpuCost, r: memoryCost, p: parallelization },
    } = options as SCryptPHCObject;

    return (
      cpuCost < this.cpuCost ||
      memoryCost < this.memoryCost ||
      parallelization < this.parallelization
    );
  }

  private async decodeAndCheckMatches(
    rawPassword: string,
    encodedPassword: string,
  ): Promise<boolean> {
    const options = deserialize(encodedPassword);
    ow(options, schema);
    const {
      params: { N, r, p },
      salt,
      hash: derived,
    } = options as SCryptPHCObject;

    const generated = await this.scrypt(rawPassword, salt, this.keyLength, {
      N,
      r,
      p,
    });

    return timingSafeEqual(derived, generated);
  }

  private async digest(rawPassword: string, salt: Buffer): Promise<string> {
    const derived = await this.scrypt(rawPassword, salt, this.keyLength, {
      N: this.cpuCost,
      r: this.memoryCost,
      p: this.parallelization,
    });

    return serialize({
      id: 'scrypt',
      params: { N: this.cpuCost, r: this.memoryCost, p: this.parallelization },
      salt,
      hash: derived,
    });
  }
}
