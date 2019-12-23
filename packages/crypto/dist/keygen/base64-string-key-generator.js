"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const key_generators_1 = require("./key-generators");
class Base64StringKeyGenerator {
    constructor(keyLength = Base64StringKeyGenerator.DEFAULT_KEY_LENGTH) {
        if (keyLength < Base64StringKeyGenerator.DEFAULT_KEY_LENGTH) {
            throw new Error(`keyLength must be greater than or equal to ${Base64StringKeyGenerator.DEFAULT_KEY_LENGTH}`);
        }
        this.keyGenerator = key_generators_1.randomKeyGenerator(keyLength);
    }
    async generateKey() {
        const key = await this.keyGenerator.generateKey();
        return key.toString('base64');
    }
}
exports.Base64StringKeyGenerator = Base64StringKeyGenerator;
Base64StringKeyGenerator.DEFAULT_KEY_LENGTH = 32;
//# sourceMappingURL=base64-string-key-generator.js.map