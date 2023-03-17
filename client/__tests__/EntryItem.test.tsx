import React from 'react';
import renderer from 'react-test-renderer';
import { Feed, Entry } from '../src/data';
import { action } from '../src/utils/tests';
import { EntryItemRef } from '../src/components/entries/EntryItem';

const feed: Feed = {
  id: 1,
  title: 'Mock feed',
  link: 'https://www.test.com',
  image: '',
  icon: '',
  count: 1,
};

const entry: Entry = {
  id: 1,
  title: 'Mock entry',
  description: '',
  link: 'https://www.test.com/1',
  isViewed: false,
  isFavorite: false,
  isRead: false,
  feed: feed,
  feedId: 0,
};

test('EntryItem isCollapseLong = true', () => {
  const render = renderer.create(
    <EntryItemRef
      entry={entry}
      isCollapseLong
      onSetRead={action}
      onSetFavorite={action}
    />
  );
  expect(render).toMatchSnapshot();
});

test('EntryItem isCollapseLong = false', () => {
  const render = renderer.create(
    <EntryItemRef
      entry={entry}
      isCollapseLong={false}
      onSetRead={action}
      onSetFavorite={action}
    />
  );
  expect(render).toMatchSnapshot();
});
