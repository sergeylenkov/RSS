import React from 'react';
import renderer from 'react-test-renderer';
import { FeedEdit } from '../src/components/feeds/FeedEdit';
import { action } from '../src/utils/tests';

test('FeedEdit isEditing = true', () => {
  const render = renderer.create(
    <FeedEdit
      isEditing
      isDisabled={false}
      isScrolled={false}
      onAdd={action}
      onEdit={action}
    />
  );
  expect(render).toMatchSnapshot();
});

test('FeedEdit isDisabled = true', () => {
  const render = renderer.create(
    <FeedEdit
      isEditing={false}
      isDisabled
      isScrolled={false}
      onAdd={action}
      onEdit={action}
    />
  );
  expect(render).toMatchSnapshot();
});

test('FeedEdit isScrolled = true', () => {
  const render = renderer.create(
    <FeedEdit
      isEditing={false}
      isDisabled={false}
      isScrolled
      onAdd={action}
      onEdit={action}
    />
  );
  expect(render).toMatchSnapshot();
});
