import { Bem } from '../src/utils/bem';

const b = new Bem('test-block');

test('bem block', () => {
  expect(b.toString()).toBe('test-block');
});

test('bem in template litarals', () => {
  expect(`${b}`).toBe('test-block');
});

test('bem toString', () => {
  expect(b.toString()).toBe('test-block');
});

test('bem block with modifier', () => {
  b.addModifier('selected');

  expect(b.toString()).toBe('test-block test-block_selected');
});

test('bem block element', () => {
  const element = b.getElement('icon');

  expect(element.toString()).toBe('test-block__icon');
});

test('bem block element with modifier', () => {
  const element = b.getElement('icon').addModifier('selected');

  expect(element.toString()).toBe('test-block__icon test-block__icon_selected');
});
