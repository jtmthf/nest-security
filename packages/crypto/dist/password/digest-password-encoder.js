"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const password_encoder_1 = require("./password-encoder");
const keygen_1 = require("../keygen");
const password_encoder_utils_1 = require("./password-encoder-utils");
const digester_1 = require("./digester");
/**
 * @deprecated
 */
class DigestPasswordEncoder extends password_encoder_1.PasswordEncoder {
    constructor(algorithm) {
        super();
        this.saltGenerator = new keygen_1.Base64StringKeyGenerator();
        this.encodeHashAsBase64 = false;
        this.digester = new digester_1.Digester(algorithm, 1);
    }
    set iterations(iterations) {
        this.digester.iterations = iterations;
    }
    async encode(rawPassword) {
        const salt = DigestPasswordEncoder.PREFIX +
            (await this.saltGenerator.generateKey()) +
            DigestPasswordEncoder.SUFFIX;
        return this.digest(salt, rawPassword);
    }
    matches(rawPassword, encodedPassword) {
        const salt = this.extractSalt(encodedPassword);
        const rawPasswordEncoded = this.digest(salt, rawPassword);
        return password_encoder_utils_1.equals(encodedPassword, rawPasswordEncoded);
    }
    digest(salt, rawPassword = '') {
        const saltedPassword = rawPassword + salt;
        const digest = this.digester.digest(Buffer.from(saltedPassword));
        const encoded = this.encodeBuffer(digest);
        return salt + encoded;
    }
    encodeBuffer(digest) {
        return digest.toString(this.encodeHashAsBase64 ? 'base64' : 'hex');
    }
    extractSalt(prefixEncodedPassword) {
        const start = prefixEncodedPassword.indexOf(DigestPasswordEncoder.PREFIX);
        if (start !== 0) {
            return '';
        }
        const end = prefixEncodedPassword.indexOf(DigestPasswordEncoder.SUFFIX, start);
        if (end < 0) {
            return '';
        }
        return prefixEncodedPassword.substring(start, end + 1);
    }
}
exports.DigestPasswordEncoder = DigestPasswordEncoder;
DigestPasswordEncoder.PREFIX = '{';
DigestPasswordEncoder.SUFFIX = '}';
//# sourceMappingURL=digest-password-encoder.js.map