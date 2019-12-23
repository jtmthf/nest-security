import { timingSafeEqual } from 'crypto';

export function equals(expected: string, actual: string): boolean {
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(actual);

  return timingSafeEqual(expectedBytes, actualBytes);
}
