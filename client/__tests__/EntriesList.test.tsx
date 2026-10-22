import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { EntriesList } from '../src/components/entries/EntriesList';
import { Entry } from '../src/data';

const ENTRY: Entry = {
  id: 1,
  feedId: 1,
  title: 'Stored entry',
  description: 'Description',
  link: 'https://example.com/1',
  isViewed: false,
  isRead: false,
  isFavorite: false,
};

function mockFetch(body: unknown) {
  const fetchMock = jest.fn().mockResolvedValue({
    json: () => Promise.resolve(body),
  });

  global.fetch = fetchMock as unknown as typeof fetch;

  return fetchMock;
}

afterEach(() => {
  jest.restoreAllMocks();
});

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

  test('loads the tab requested by the route', async () => {
    const fetchMock = mockFetch([ENTRY]);

    renderWithProviders(<EntriesList />, {
      useRouter: true,
      route: '/all',
      preloadedState: { isInitialized: true },
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    expect(fetchMock.mock.calls[0][0]).toContain('entries');
    expect(await screen.findByText('Stored entry')).toBeInTheDocument();
  });

  test('treats a trailing slash as the same tab', async () => {
    const fetchMock = mockFetch([ENTRY]);

    renderWithProviders(<EntriesList />, {
      useRouter: true,
      route: '/favorites/',
      preloadedState: { isInitialized: true },
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    // `/favorites/` must reach the favorites endpoint instead of falling
    // through every comparison.
    expect(fetchMock.mock.calls[0][0]).toContain('entries/favorites');
  });

  test('treats a percent-encoded route as the same tab', async () => {
    const fetchMock = mockFetch([ENTRY]);

    renderWithProviders(<EntriesList />, {
      useRouter: true,
      route: '/%72ead',
      preloadedState: { isInitialized: true },
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    expect(fetchMock.mock.calls[0][0]).toContain('entries/read');
  });

  test('requests nothing for an unknown route', async () => {
    const fetchMock = mockFetch([ENTRY]);

    const { store } = renderWithProviders(<EntriesList />, {
      useRouter: true,
      route: '/unknown',
      preloadedState: {
        isInitialized: true,
        entries: [ENTRY],
        allEntries: [ENTRY],
      },
    });

    // The entries of the previous tab must not be left on screen as if they
    // belonged to the current route.
    await waitFor(() => expect(store.getState().entries).toHaveLength(0));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('waits for the feeds and then loads the entries', async () => {
    const fetchMock = mockFetch([ENTRY]);

    const { store } = renderWithProviders(<EntriesList />, {
      useRouter: true,
      route: '/all',
      preloadedState: { isInitialized: false },
    });

    expect(fetchMock).not.toHaveBeenCalled();

    store.dispatch({ type: 'FEEDS_UPDATED', feeds: [] });

    // The very first render can happen before the feeds arrive; the list must
    // pick the entries up as soon as it is initialised.
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });
});
