"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
function equals(expected, actual) {
    const expectedBytes = Buffer.from(expected);
    const actualBytes = Buffer.from(actual);
    return crypto_1.timingSafeEqual(expectedBytes, actualBytes);
}
exports.equals = equals;
//# sourceMappingURL=password-encoder-utils.js.map