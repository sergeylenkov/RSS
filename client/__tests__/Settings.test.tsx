import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import store from '../src/store';
import Settings from '../src/components/settings/Settings';

test('Settings correct rendering', () => {
  const render = renderer.create(
    <Provider store={store}>
      <Settings isVisible />
    </Provider>
  );
  expect(render).toMatchSnapshot();
});