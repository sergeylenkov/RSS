import React from 'react';
import renderer  from 'react-test-renderer';
import { action } from '../src/utils/tests';
import SettingsButton from '../src/components/settings/SettingsButton';

test('SettingsButton correct rendering', () => {
  const render = renderer.create(<SettingsButton isActive onClick={action} />);
  expect(render).toMatchSnapshot();
});