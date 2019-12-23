"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function equalsIgnoreCase(a, b) {
    if (a == null && b == null) {
        return true;
    }
    if (a != null && b != null) {
        return a.toUpperCase() === b.toUpperCase();
    }
    return false;
}
exports.equalsIgnoreCase = equalsIgnoreCase;
//# sourceMappingURL=utils.js.map