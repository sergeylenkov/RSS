import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import store from '../src/store';
import { FeedsList } from '../src/components/feeds/FeedsList';

test('FeedsList', () => {
  const render = renderer.create(
    <Provider store={store}>
      <FeedsList />
    </Provider>
  );
  expect(render).toMatchSnapshot();
});
