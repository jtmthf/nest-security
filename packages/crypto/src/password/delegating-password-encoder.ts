import { inspect } from 'util';
import { PasswordEncoder } from './password-encoder';
import { MaybePromise, equalsIgnoreCase } from '@nestjs-security/utils';
import { deserialize } from '@phc/format';

const extractId = Symbol('extractId');

export class DelegatingPasswordEncoder extends PasswordEncoder {
  private readonly passwordEncoderForEncode: PasswordEncoder;
  private _defaultPasswordEncoderForMatches: PasswordEncoder;

  constructor(
    private readonly idForEncode: string,
    private readonly idToPasswordEncoder: Map<string, PasswordEncoder>,
  ) {
    super();
    if (idForEncode == null) {
      throw new Error('idForEncode must be defined');
    }
    if (!idToPasswordEncoder.has(idForEncode)) {
      throw new Error(
        `idForEncode ${idForEncode} is not found is idToPasswordEncoder ${inspect(
          idToPasswordEncoder,
        )}`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.passwordEncoderForEncode = idToPasswordEncoder.get(idForEncode)!;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this._defaultPasswordEncoderForMatches = new UnmappedIdPasswordEncoder(
      this,
    );
  }

  set defaultPasswordEncoderForMatches(
    defaultPasswordEncoderForMatches: PasswordEncoder,
  ) {
    if (defaultPasswordEncoderForMatches == null) {
      throw new Error('defaultPasswordEncoderForMatches must be defined');
    }
    this._defaultPasswordEncoderForMatches = defaultPasswordEncoderForMatches;
  }

  encode(rawPassword: string): MaybePromise<string> {
    return this.passwordEncoderForEncode.encode(rawPassword);
  }

  matches(rawPassword: string, encodedPassword: string): MaybePromise<boolean> {
    if (rawPassword == null && encodedPassword == null) {
      return true;
    }
    const id = this[extractId](encodedPassword);
    const delegate = this.idToPasswordEncoder.get(id);
    if (delegate === undefined) {
      return this._defaultPasswordEncoderForMatches.matches(
        rawPassword,
        encodedPassword,
      );
    }
    return delegate.matches(rawPassword, encodedPassword);
  }

  upgradeEncoding(encodedPassword: string): boolean {
    const id = this[extractId](encodedPassword);
    if (!equalsIgnoreCase(this.idForEncode, id)) {
      return true;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.idToPasswordEncoder.get(id)!.upgradeEncoding(encodedPassword);
    }
  }

  [extractId](prefixEncodedPassword: string): string {
    return deserialize(prefixEncodedPassword).id;
  }
}

class UnmappedIdPasswordEncoder extends PasswordEncoder {
  constructor(
    private readonly delegatingPasswordEncoder: DelegatingPasswordEncoder,
  ) {
    super();
  }

  encode(): string {
    throw new Error('encode is not supported');
  }

  matches(_rawPassword: string, prefixEncodedPassword: string): boolean {
    const id = this.delegatingPasswordEncoder[extractId](prefixEncodedPassword);
    throw new Error(`There is no PasswordEncoder mapped for the id "${id}"`);
  }
}
