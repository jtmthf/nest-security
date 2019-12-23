import { Hash } from 'crypto';

export class Digester {
  private _iterations!: number;

  constructor(public readonly algorithm: string, iterations: number) {
    // eagerly validate the algorithm
    Digester.createHash(algorithm);
    this.iterations = iterations;
  }

  digest(value: Buffer): Buffer {
    for (let i = 0; i < this._iterations; i++) {
      const hash = Digester.createHash(this.algorithm);
      hash.update(value);
      value = hash.digest();
    }
    return value;
  }

  set iterations(iterations: number) {
    if (iterations <= 0) {
      throw new Error('Iterations value must be greater than zero');
    }
    this._iterations = iterations;
  }

  private static createHash(algorithm: string): Hash {
    try {
      return this.createHash(algorithm);
    } catch {
      throw new Error(`No such hashing algorithm ${algorithm}`);
    }
  }
}
