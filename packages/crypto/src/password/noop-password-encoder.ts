import { PasswordEncoder } from "./password-encoder";
import { serialize } from "@phc/format";

/**
 * @deprecated
 */
export class NoopPasswordEncoder extends PasswordEncoder {
  encode(rawPassword: string) {
    return serialize({id: 'noop', hash: Buffer.from(rawPassword)})
  }
}