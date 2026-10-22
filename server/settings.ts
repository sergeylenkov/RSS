import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

interface Settings {
  debug: boolean;
  db: string;
  port: string;
}

function arg(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

/**
 * Settings are read through getters rather than captured once at import time.
 *
 * ES module imports are hoisted, so a module such as `test/api.ts` that sets
 * `process.env.RSS_DB` on its first line would otherwise be read *after*
 * `settings` was already initialised — and the tests would silently run
 * against the working database.
 */
const settings: Settings = {
  get debug(): boolean {
    return Boolean(args.debug) || Boolean(process.env.RSS_DEBUG);
  },
  get db(): string {
    // Environment variables win over CLI flags so tests and containers can
    // override the defaults without touching the start script.
    return process.env.RSS_DB || arg(args.db) || 'db/database.sqlite';
  },
  get port(): string {
    return process.env.RSS_PORT || arg(args.p) || '5010';
  },
};

export default settings;
