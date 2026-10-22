import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import App from '../src/App';

describe('App', () => {
  beforeEach(() => {
    const mockJson = { json: () => Promise.resolve([]) };

    (global as unknown as { fetch: jest.Mock }).fetch = jest.fn(() =>
      Promise.resolve(mockJson)
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Wait for App's async effects (getFeeds + clearEntries) to settle
  // inside act() so no "not wrapped in act" warnings are emitted.
  async function flushEffects(): Promise<void> {
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  }

  test('renders the menu items', async () => {
    renderWithProviders(<App />);

    expect(screen.getByText('Свежее')).toBeInTheDocument();
    expect(screen.getByText('Все')).toBeInTheDocument();
    expect(screen.getByText('Прочитанное')).toBeInTheDocument();
    expect(screen.getByText('Избранное')).toBeInTheDocument();

    await flushEffects();
  });

  test('renders the container layout', async () => {
    const { container } = renderWithProviders(<App />);

    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(container.querySelector('.content')).toBeInTheDocument();
    expect(container.querySelector('.feeds')).toBeInTheDocument();

    await flushEffects();
  });

  test('loads feeds on mount', async () => {
    renderWithProviders(<App />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
