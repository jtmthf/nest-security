"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PasswordEncoder {
    /**
     * Returns true if the encoded password should be encoded again for better security,
     * else false. The default implementation always returns false.
     *
     * @param encodedPassword the encoded password to check
     * @return true if the encoded password should be encoded again for better security,
     * else false.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    upgradeEncoding(_encodedPassword) {
        return false;
    }
}
exports.PasswordEncoder = PasswordEncoder;
//# sourceMappingURL=password-encoder.js.map