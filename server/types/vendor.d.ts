/**
 * Ambient declarations for dependencies that ship no type definitions.
 */

declare module 'minimist' {
  interface ParsedArgs {
    _: Array<string | number>;
    [key: string]: unknown;
  }

  function minimist(
    args: string[],
    opts?: { string?: string[]; boolean?: string[]; default?: Record<string, unknown> }
  ): ParsedArgs;

  export = minimist;
}
