import { StringKeyGenerator } from './string-key-generator';
export declare class Base64StringKeyGenerator implements StringKeyGenerator {
    private static readonly DEFAULT_KEY_LENGTH;
    private readonly keyGenerator;
    constructor(keyLength?: number);
    generateKey(): Promise<string>;
}
//# sourceMappingURL=base64-string-key-generator.d.ts.map