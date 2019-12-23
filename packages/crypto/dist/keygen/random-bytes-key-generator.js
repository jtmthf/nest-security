"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const util_1 = require("util");
/**
 * @sealed
 */
class RandomBytesKeyGenerator {
    constructor(keyLength = RandomBytesKeyGenerator.DEFAULT_KEY_LENGTH) {
        this.keyLength = keyLength;
        this.random = util_1.promisify(crypto_1.randomBytes);
    }
    generateKey() {
        return this.random(this.keyLength);
    }
}
exports.RandomBytesKeyGenerator = RandomBytesKeyGenerator;
RandomBytesKeyGenerator.DEFAULT_KEY_LENGTH = 8;
//# sourceMappingURL=random-bytes-key-generator.js.map