"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_bytes_key_generator_1 = require("./random-bytes-key-generator");
function randomKeyGenerator(keyLength) {
    return new random_bytes_key_generator_1.RandomBytesKeyGenerator(keyLength);
}
exports.randomKeyGenerator = randomKeyGenerator;
//# sourceMappingURL=key-generators.js.map