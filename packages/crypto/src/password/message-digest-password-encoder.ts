import { PasswordEncoder } from './password-encoder';
import { StringKeyGenerator, Base64StringKeyGenerator } from '../keygen';
import { equals } from './password-encoder-utils';
import { Digester } from './digester';
import { serialize, deserialize } from '@phc/format';
import ow from 'ow';

interface MessageDigestPHCObject {
  id: string;
  salt: Buffer;
  hash: Buffer;
}

/**
 * @deprecated
 */
export class MessageDigestPasswordEncoder extends PasswordEncoder {
  private saltGenerator: StringKeyGenerator = new Base64StringKeyGenerator();
  private digester: Digester;
  encodeHashAsBase64 = false;

  constructor(algorithm: string) {
    super();
    this.digester = new Digester(algorithm, 1);
  }

  set iterations(iterations: number) {
    this.digester.iterations = iterations;
  }

  async encode(rawPassword: string): Promise<string> {
    return this.digest(await this.saltGenerator.generateKey(), rawPassword);
  }

  matches(rawPassword: string, encodedPassword: string): boolean {
    const options = deserialize(encodedPassword);
    ow(
      options,
      ow.object.exactShape({
        id: ow.string.equals(this.digester.algorithm),
        salt: ow.buffer,
        hash: ow.buffer,
      }),
    );
    const { salt } = options as MessageDigestPHCObject;
    const rawPasswordEncoded = this.digest(salt.toString(), rawPassword);
    return equals(encodedPassword, rawPasswordEncoded);
  }

  private digest(salt: string, rawPassword: string): string {
    const saltedPassword = rawPassword + salt;

    const digest = this.digester.digest(Buffer.from(saltedPassword));

    return serialize({
      id: this.digester.algorithm,
      hash: digest,
      salt: Buffer.from(salt),
    });
  }
}
