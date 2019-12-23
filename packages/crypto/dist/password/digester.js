"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Digester {
    constructor(algorithm, iterations) {
        this.algorithm = algorithm;
        // eagerly validate the algorithm
        Digester.createHash(algorithm);
        this.iterations = iterations;
    }
    digest(value) {
        for (let i = 0; i < this._iterations; i++) {
            const hash = Digester.createHash(this.algorithm);
            hash.update(value);
            value = hash.digest();
        }
        return value;
    }
    set iterations(iterations) {
        if (iterations <= 0) {
            throw new Error('Iterations value must be greater than zero');
        }
        this._iterations = iterations;
    }
    static createHash(algorithm) {
        try {
            return this.createHash(algorithm);
        }
        catch (_a) {
            throw new Error(`No such hashing algorithm ${algorithm}`);
        }
    }
}
exports.Digester = Digester;
//# sourceMappingURL=digester.js.map