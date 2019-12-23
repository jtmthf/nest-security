import { MaybePromise } from '@nestjs-security/utils';

export abstract class PasswordEncoder {
  /**
   * Encode the raw password. Generally, a good encoding algorithm applies a
   * SHA-1 or greater hash combined with an 8-byte or greater randomly generated
   * salt.
   */
  abstract encode(rawPassword: string): MaybePromise<string>;

  /**
   * Verify the encoded password obtained from storage matches the submitted raw
   * password after it too is encoded. Returns true if the passwords match, false if
   * they do not. The stored password itself is never decoded.
   *
   * @param rawPassword the raw password to encode and match
   * @param encodedPassword the encoded password from storage to compare with
   * @return true if the raw password, after encoding, matches the encoded password from
   * storage
   */
  abstract matches(
    rawPassword: string,
    encodedPassword: string,
  ): MaybePromise<boolean>;

  /**
   * Returns true if the encoded password should be encoded again for better security,
   * else false. The default implementation always returns false.
   *
   * @param encodedPassword the encoded password to check
   * @return true if the encoded password should be encoded again for better security,
   * else false.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  upgradeEncoding(_encodedPassword: string): boolean {
    return false;
  }
}
