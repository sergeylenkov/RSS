import React from 'react';
import renderer  from 'react-test-renderer';
import { Feed, Entry } from '../src/data';
import { action } from '../src/utils/tests';
import EntryItem from '../src/components/entries/EntryItem';

const feed: Feed = {
  id: 1,
  title: 'Mock feed',
  link: 'https://www.test.com',
  image: '',
  icon: '',
  count: 1
}

const entry: Entry = {
  id: 1,
  title: 'Mock entry',
  description: '',
  link: 'https://www.test.com/1',
  isViewed: false,
  isFavorite: false,
  isRead: false,
  feed: feed,
  feedId: 0
}

test('EntryItem correct rendering', () => {
  const render = renderer.create(<EntryItem entry={entry} isCollapseLong onView={action} onSetRead={action} onSetFavorite={action} />);
  expect(render).toMatchSnapshot();
});