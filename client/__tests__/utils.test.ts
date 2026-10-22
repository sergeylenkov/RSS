import { debounce, isSystemDarkTheme, normalizePath } from '../src/utils';

test('debounce', () => {
  const action = debounce(() => {
    expect(true).toBe(true);
  }, 500);

  action();
});

test('debounce immediate', () => {
  const action = debounce(() => {
    expect(true).toBe(true);
  }, 500);

  action();
});

test('isSystemDarkTheme', () => {
  expect(typeof isSystemDarkTheme()).toBe('boolean');
});

describe('normalizePath', () => {
  test('keeps the plain tab paths', () => {
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('/all')).toBe('/all');
    expect(normalizePath('/read')).toBe('/read');
    expect(normalizePath('/favorites')).toBe('/favorites');
  });

  test('drops trailing slashes', () => {
    expect(normalizePath('/all/')).toBe('/all');
    expect(normalizePath('/all//')).toBe('/all');
    expect(normalizePath('/read/')).toBe('/read');
  });

  test('maps an empty pathname to the root', () => {
    expect(normalizePath('')).toBe('/');
    expect(normalizePath(undefined)).toBe('/');
    expect(normalizePath('/')).toBe('/');
  });

  test('decodes percent-encoded characters', () => {
    expect(normalizePath('/%61ll')).toBe('/all');
    expect(normalizePath('/favorites%2F')).toBe('/favorites');
    expect(normalizePath('/%66avorites')).toBe('/favorites');
  });

  test('does not throw on a malformed escape sequence', () => {
    expect(normalizePath('/%E0%A4%A')).toBe('/%E0%A4%A');
    expect(normalizePath('/%')).toBe('/%');
  });

  test('keeps unknown paths intact', () => {
    expect(normalizePath('/unknown')).toBe('/unknown');
  });
});
