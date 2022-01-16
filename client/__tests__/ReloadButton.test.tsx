import React from 'react';
import renderer from 'react-test-renderer';
import { action } from '../src/utils/tests';
import ReloadButton from '../src/components/menu/ReloadButton';

test('ReloadButton isActive = true', () => {
  const render = renderer.create(
    <ReloadButton
      isActive
      isError={false}
      isSelected={false}
      count={10}
      onClick={action}
      onUpdate={action}
    />
  );
  expect(render).toMatchSnapshot();
});

test('ReloadButton isActive = false', () => {
  const render = renderer.create(
    <ReloadButton
      isActive={false}
      isError={false}
      isSelected={false}
      count={10}
      onClick={action}
      onUpdate={action}
    />
  );
  expect(render).toMatchSnapshot();
});

test('ReloadButton isError = true', () => {
  const render = renderer.create(
    <ReloadButton
      isActive={false}
      isError
      isSelected={false}
      count={10}
      onClick={action}
      onUpdate={action}
    />
  );
  expect(render).toMatchSnapshot();
});

test('ReloadButton isSelected = true', () => {
  const render = renderer.create(
    <ReloadButton
      isActive={false}
      isError={false}
      isSelected={false}
      count={10}
      onClick={action}
      onUpdate={action}
    />
  );
  expect(render).toMatchSnapshot();
});
