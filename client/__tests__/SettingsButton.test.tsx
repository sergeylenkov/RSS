import React from 'react';
import renderer  from 'react-test-renderer';
import SettingsButton from '../src/components/settings/SettingsButton';

test('SettingsButton contains correct text', () => {
  const button = renderer.create(<SettingsButton isActive onClick={() => { return; }} />);
  expect(button).toMatchSnapshot();
});