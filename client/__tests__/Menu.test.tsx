import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import store from '../src/store';
import { action } from '../src/utils/tests';
import Menu from '../src/components/menu/Menu';

test('Menu correct rendering', () => {
  const render = renderer.create(
    <Provider store={store}>
      <BrowserRouter><Menu onUpdate={action} /></BrowserRouter>
    </Provider>
  );
  expect(render).toMatchSnapshot();
});