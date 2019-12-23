declare module '@phc/format' {
  export interface PHCOptions {
    id: string;
    version?: number;
    params?: Record<string, string | number>;
    salt?: Buffer;
    hash?: Buffer;
  }

  export function serialize(options: PHCOptions): string;
  export function deserialize(phcstr: string): PHCOptions;
}
