import { isLong, removeSelfLinks } from '../src/utils/entry';

test('entry utils removeSelfLinks', () => {
  const result = removeSelfLinks('<div><a href="https://www.test.com/">link</a></div>', 'https://www.test.com/');

  expect(result).toBe('<div></div>');
});

test('entry utils isLong (short text)', () => {
  const result = isLong('<div>Short description</div>');
  expect(result).toBe(false);
})

test('entry utils isLong (images > 3)', () => {
  const result = isLong('<img></img><img></img><img></img><img></img><img></img>');
  expect(result).toBe(true);
})