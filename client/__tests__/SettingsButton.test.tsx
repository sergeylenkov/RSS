import React from 'react';
import renderer  from 'react-test-renderer';
import SettingsButton from '../src/components/settings/SettingsButton';

test('SettingsButton correct rendering', () => {
  const render = renderer.create(<SettingsButton isActive onClick={() => { return; }} />);
  expect(render).toMatchSnapshot();
});