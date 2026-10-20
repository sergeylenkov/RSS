import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { FeedsList } from '../src/components/feeds/FeedsList';

describe('FeedsList', () => {
  test('renders the feed edit controls', () => {
    renderWithProviders(<FeedsList />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  test('renders no feed items when the store has no feeds', () => {
    const { container } = renderWithProviders(<FeedsList />);

    expect(container.querySelectorAll('.feed-item')).toHaveLength(0);
  });
});