import { PasswordEncoder } from './password-encoder';
import { MaybePromise } from '@nestjs-security/utils';
declare const extractId: unique symbol;
export declare class DelegatingPasswordEncoder extends PasswordEncoder {
    private readonly idForEncode;
    private readonly idToPasswordEncoder;
    private static readonly PREFIX;
    private static readonly SUFFIX;
    private readonly passwordEncoderForEncode;
    private _defaultPasswordEncoderForMatches;
    constructor(idForEncode: string, idToPasswordEncoder: Map<string | undefined, PasswordEncoder>);
    set defaultPasswordEncoderForMatches(defaultPasswordEncoderForMatches: PasswordEncoder);
    encode(rawPassword: string): Promise<string>;
    matches(rawPassword: string, prefixEncodedPassword: string): MaybePromise<boolean>;
    upgradeEncoding(prefixEncodedPassword: string): boolean;
    [extractId](prefixEncodedPassword: string): string | undefined;
    private extractEncodedPassword;
}
export {};
//# sourceMappingURL=delegating-password-encoder.d.ts.map