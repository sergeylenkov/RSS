import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import store from '../src/store';
import { EntriesList } from '../src/components/entries/EntriesList';

test('EntriesList', () => {
  const render = renderer.create(
    <Provider store={store}>
      <BrowserRouter>
        <EntriesList />
      </BrowserRouter>
    </Provider>
  );
  expect(render).toMatchSnapshot();
});
