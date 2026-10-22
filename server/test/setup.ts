import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * Points the app at a throwaway database and an ephemeral port.
 *
 * This module must be imported *before* anything that reaches `db.ts`, and it
 * must be the very first import of the test file: ES module imports are
 * hoisted, so performing this inline in `api.ts` would run too late and the
 * tests would silently use `db/database.sqlite`.
 */
process.env.RSS_DB = path.join(
  fs.mkdtempSync(path.join(os.tmpdir(), 'rss-test-')),
  'test.sqlite'
);
process.env.RSS_PORT = '0';

export const TEST_DB = process.env.RSS_DB;
