/// <reference types="node" />
export declare class Digester {
    private readonly algorithm;
    private _iterations;
    constructor(algorithm: string, iterations: number);
    digest(value: Buffer): Buffer;
    set iterations(iterations: number);
    private static createHash;
}
//# sourceMappingURL=digester.d.ts.map