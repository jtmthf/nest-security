"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const password_encoder_1 = require("./password-encoder");
const utils_1 = require("@nestjs-security/utils");
const extractId = Symbol('extractId');
class DelegatingPasswordEncoder extends password_encoder_1.PasswordEncoder {
    constructor(idForEncode, idToPasswordEncoder) {
        super();
        this.idForEncode = idForEncode;
        this.idToPasswordEncoder = idToPasswordEncoder;
        if (idForEncode == null) {
            throw new Error('idForEncode must be defined');
        }
        if (!idToPasswordEncoder.has(idForEncode)) {
            throw new Error(`idForEncode ${idForEncode} is not found is idToPasswordEncoder ${util_1.inspect(idToPasswordEncoder)}`);
        }
        for (const id of idToPasswordEncoder.keys()) {
            if (id == null) {
                continue;
            }
            if (id.includes(DelegatingPasswordEncoder.PREFIX)) {
                throw new Error(`id ${id} cannot contain ${DelegatingPasswordEncoder.PREFIX}`);
            }
            if (id.includes(DelegatingPasswordEncoder.SUFFIX)) {
                throw new Error(`id ${id} cannot contain ${DelegatingPasswordEncoder.SUFFIX}`);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.passwordEncoderForEncode = idToPasswordEncoder.get(idForEncode);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        this._defaultPasswordEncoderForMatches = new UnmappedIdPasswordEncoder(this);
    }
    set defaultPasswordEncoderForMatches(defaultPasswordEncoderForMatches) {
        if (defaultPasswordEncoderForMatches == null) {
            throw new Error('defaultPasswordEncoderForMatches must be defined');
        }
        this._defaultPasswordEncoderForMatches = defaultPasswordEncoderForMatches;
    }
    async encode(rawPassword) {
        return (DelegatingPasswordEncoder.PREFIX +
            this.idForEncode +
            DelegatingPasswordEncoder.SUFFIX +
            (await this.passwordEncoderForEncode.encode(rawPassword)));
    }
    matches(rawPassword, prefixEncodedPassword) {
        if (rawPassword == null && prefixEncodedPassword == null) {
            return true;
        }
        const id = this[extractId](prefixEncodedPassword);
        const delegate = this.idToPasswordEncoder.get(id);
        if (delegate === undefined) {
            return this._defaultPasswordEncoderForMatches.matches(rawPassword, prefixEncodedPassword);
        }
        const encodedPassword = this.extractEncodedPassword(prefixEncodedPassword);
        return delegate.matches(rawPassword, encodedPassword);
    }
    upgradeEncoding(prefixEncodedPassword) {
        const id = this[extractId](prefixEncodedPassword);
        if (!utils_1.equalsIgnoreCase(this.idForEncode, id)) {
            return true;
        }
        else {
            const encodedPassword = this.extractEncodedPassword(prefixEncodedPassword);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.idToPasswordEncoder.get(id).upgradeEncoding(encodedPassword);
        }
    }
    [extractId](prefixEncodedPassword) {
        if (prefixEncodedPassword == null) {
            return undefined;
        }
        const start = prefixEncodedPassword.indexOf(DelegatingPasswordEncoder.PREFIX);
        if (start !== 0) {
            return undefined;
        }
        const end = prefixEncodedPassword.indexOf(DelegatingPasswordEncoder.SUFFIX, start);
        if (end < 0) {
            return undefined;
        }
        return prefixEncodedPassword.substring(start + 1, end);
    }
    extractEncodedPassword(prefixEncodedPassword) {
        const start = prefixEncodedPassword.indexOf(DelegatingPasswordEncoder.SUFFIX);
        return prefixEncodedPassword.substring(start + 1);
    }
}
exports.DelegatingPasswordEncoder = DelegatingPasswordEncoder;
DelegatingPasswordEncoder.PREFIX = '{';
DelegatingPasswordEncoder.SUFFIX = '}';
class UnmappedIdPasswordEncoder extends password_encoder_1.PasswordEncoder {
    constructor(delegatingPasswordEncoder) {
        super();
        this.delegatingPasswordEncoder = delegatingPasswordEncoder;
    }
    encode() {
        throw new Error('encode is not supported');
    }
    matches(_rawPassword, prefixEncodedPassword) {
        const id = this.delegatingPasswordEncoder[extractId](prefixEncodedPassword);
        throw new Error(`There is no PasswordEncoder mapped for the id "${id}"`);
    }
}
//# sourceMappingURL=delegating-password-encoder.js.map