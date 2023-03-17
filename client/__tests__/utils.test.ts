import { debounce } from '../src/utils';

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
