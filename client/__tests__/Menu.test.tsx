import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import store from '../src/store';
import { Menu } from '../src/components/menu/Menu';

test('Menu', () => {
  const render = renderer.create(
    <Provider store={store}>
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    </Provider>
  );
  expect(render).toMatchSnapshot();
});
