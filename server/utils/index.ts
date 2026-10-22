import settings from '../settings';

/**
 * Logs only when debugging is enabled (`--debug` or `RSS_DEBUG`).
 */
export function log(...args: unknown[]): void {
  if (settings.debug) {
    console.log(...args);
  }
}
