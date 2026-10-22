export const debounce = <F extends (...args: unknown[]) => unknown>(
  func: F,
  waitFor: number
) => {
  let timeout = 0;

  const debounced = (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor) as unknown as number;
  };

  return debounced as unknown as (...args: Parameters<F>) => ReturnType<F>;
};

export function isSystemDarkTheme(): boolean {
  return Boolean(
    window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

/**
 * Normalises a `useLocation().pathname` value so it can be compared with the
 * route constants safely:
 *
 * - `/all/` -> `/all`, `/all//` -> `/all` (repeated trailing slashes)
 * - `/%61ll` -> `/all` (percent-encoded characters are decoded)
 * - `` (empty) -> `/`
 *
 * Query strings and hashes are not part of `pathname`, so they never reach
 * this helper. Undecodable sequences are kept verbatim instead of throwing.
 */
export function normalizePath(pathname: string | undefined): string {
  const raw = pathname || '/';

  let decoded = raw;

  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }

  const trimmed = decoded.replace(/\/+$/, '');

  return trimmed === '' ? '/' : trimmed;
}