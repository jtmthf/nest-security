import {
  PasswordEncoder,
  DelegatingPasswordEncoder,
  MessageDigestPasswordEncoder,
  Pbkdf2PasswordEncoder,
  SCryptPasswordEncoder,
} from '../password';

export function createDelegatingPasswordEncoder(): PasswordEncoder {
  const encodingId = 'pbkdf2';

  return new DelegatingPasswordEncoder(
    encodingId,
    new Map<string, PasswordEncoder>([
      ['md4', new MessageDigestPasswordEncoder('md4')],
      ['md5', new MessageDigestPasswordEncoder('md5')],
      [encodingId, new Pbkdf2PasswordEncoder()],
      ['scrypt', new SCryptPasswordEncoder()],
      ['sha1', new MessageDigestPasswordEncoder('sha1')],
      ['sha256', new MessageDigestPasswordEncoder('sha256')],
    ]),
  );
}

export const delegatingPasswordEncoderFactory = {
  provide: PasswordEncoder,
  useFactory: createDelegatingPasswordEncoder,
};
