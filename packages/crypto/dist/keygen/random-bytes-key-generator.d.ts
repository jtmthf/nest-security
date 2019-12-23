/// <reference types="node" />
import { BytesKeyGenerator } from './bytes-key-generator';
/**
 * @sealed
 */
export declare class RandomBytesKeyGenerator implements BytesKeyGenerator {
    readonly keyLength: number;
    private static readonly DEFAULT_KEY_LENGTH;
    private readonly random;
    constructor(keyLength?: number);
    generateKey(): Promise<Buffer>;
}
//# sourceMappingURL=random-bytes-key-generator.d.ts.map