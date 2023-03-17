import React from 'react';
import renderer from 'react-test-renderer';
import { Settings } from '../src/components/settings/Settings';

test('Settings', () => {
  const render = renderer.create(
    <Settings />
  );
  expect(render).toMatchSnapshot();
});
