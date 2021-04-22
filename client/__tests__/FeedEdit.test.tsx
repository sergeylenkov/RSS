import React from 'react';
import renderer  from 'react-test-renderer';
import FeedEdit from '../src/components/feeds/FeedEdit';
import { action } from '../src/utils/tests';

test('FeedEdit correct rendering', () => {
  const render = renderer.create(<FeedEdit isEditing isDisabled={false} isScrolled={false} onAdd={action} onEdit={action} />);
  expect(render).toMatchSnapshot();
});