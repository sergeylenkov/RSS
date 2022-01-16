import React from 'react';
import renderer from 'react-test-renderer';
import { action } from '../src/utils/tests';
import MenuButton from '../src/components/menu/MenuButton';

test('MenuButton isSelected = true', () => {
  const render = renderer.create(
    <MenuButton title={'Test'} isSelected count={10} onClick={action} />
  );
  expect(render).toMatchSnapshot();
});

test('MenuButton isSelected = false', () => {
  const render = renderer.create(
    <MenuButton title={'Test'} isSelected={false} count={10} onClick={action} />
  );
  expect(render).toMatchSnapshot();
});

test('MenuButton count = 0', () => {
  const render = renderer.create(
    <MenuButton title={'Test'} isSelected count={0} onClick={action} />
  );
  expect(render).toMatchSnapshot();
});
