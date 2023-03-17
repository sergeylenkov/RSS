import React from 'react';
import renderer from 'react-test-renderer';
import { FeedItem } from '../src/components/feeds/FeedItem';
import { action } from '../src/utils/tests';

test('FeedItem isSelected = true', () => {
  const render = renderer.create(
    <FeedItem
      id={1}
      icon={''}
      title={'Test'}
      count={0}
      isEditing={false}
      isSelected
      onSelect={action}
      onChange={action}
      onDelete={action}
    />
  );
  expect(render).toMatchSnapshot();
});

test('FeedItem isEditing = true', () => {
  const render = renderer.create(
    <FeedItem
      id={1}
      icon={''}
      title={'Test'}
      count={0}
      isEditing
      isSelected={false}
      onSelect={action}
      onChange={action}
      onDelete={action}
    />
  );
  expect(render).toMatchSnapshot();
});
