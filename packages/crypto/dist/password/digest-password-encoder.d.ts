import { PasswordEncoder } from './password-encoder';
/**
 * @deprecated
 */
export declare class DigestPasswordEncoder extends PasswordEncoder {
    private static readonly PREFIX;
    private static readonly SUFFIX;
    private saltGenerator;
    private digester;
    encodeHashAsBase64: boolean;
    constructor(algorithm: string);
    set iterations(iterations: number);
    encode(rawPassword: string): Promise<string>;
    matches(rawPassword: string, encodedPassword: string): boolean;
    private digest;
    private encodeBuffer;
    private extractSalt;
}
//# sourceMappingURL=digest-password-encoder.d.ts.map