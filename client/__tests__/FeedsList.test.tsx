import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import store from '../src/store';
import { action } from '../src/utils/tests';
import FeedsList from '../src/components/feeds/FeedsList';

test('FeedsList correct rendering', () => {
  const render = renderer.create(
    <Provider store={store}>
      <FeedsList onAddFeed={action} onChangeFeed={action} onDeleteFeed={action} />
    </Provider>
  );
  expect(render).toMatchSnapshot();
});