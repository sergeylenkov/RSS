import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import App from '../src/App';
import store from '../src/store';

test('App', () => {
  const render = renderer.create(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(render).toMatchSnapshot();
});
