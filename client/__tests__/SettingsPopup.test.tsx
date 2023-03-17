import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import store from '../src/store';
import { SettingsPopup } from '../src/components/settings/SettingsPopup';

test('SettingsPopup isVisible = true', () => {
  const render = renderer.create(
    <Provider store={store}>
      <SettingsPopup isVisible />
    </Provider>
  );
  expect(render).toMatchSnapshot();
});

test('SettingsPopup isVisible = false', () => {
  const render = renderer.create(
    <Provider store={store}>
      <SettingsPopup isVisible={false} />
    </Provider>
  );
  expect(render).toMatchSnapshot();
});
