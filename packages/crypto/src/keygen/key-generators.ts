import { RandomBytesKeyGenerator } from './random-bytes-key-generator';
import { BytesKeyGenerator } from './bytes-key-generator';

export function randomKeyGenerator(keyLength?: number): BytesKeyGenerator {
  return new RandomBytesKeyGenerator(keyLength);
}
