import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { EntriesList } from '../src/components/entries/EntriesList';

describe('EntriesList', () => {
  test('renders the entries list container', () => {
    const { container } = renderWithProviders(<EntriesList />, {
      useRouter: true,
    });

    expect(container.querySelector('.entries-list')).toBeInTheDocument();
  });

  test('renders no entry items when the store has no entries', () => {
    const { container } = renderWithProviders(<EntriesList />, {
      useRouter: true,
    });

    expect(container.querySelectorAll('.entry-item')).toHaveLength(0);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});