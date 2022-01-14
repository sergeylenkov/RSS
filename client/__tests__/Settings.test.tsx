import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import store from '../src/store';
import Settings from '../src/components/settings/Settings';

test('Settings isVisible = true', () => {
  const render = renderer.create(
    <Provider store={store}>
      <Settings isVisible />
    </Provider>
  );
  expect(render).toMatchSnapshot();
});

test('Settings isVisible = false', () => {
  const render = renderer.create(
    <Provider store={store}>
      <Settings isVisible={false} />
    </Provider>
  );
  expect(render).toMatchSnapshot();
});
