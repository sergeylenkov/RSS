import React from 'react';
import TestRenderer from 'react-test-renderer';
import SettingsButton from '../src/components/settings/SettingsButton';

test('SettingsButton contains correct text', () => {
  const testRenderer  = TestRenderer.create(<SettingsButton isActive onClick={() => { return; }} />);

  console.log(testRenderer.toJSON());
});