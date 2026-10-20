import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { Settings } from '../src/components/settings/Settings';

describe('Settings', () => {
  test('renders the settings button', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('popup is hidden initially', () => {
    renderWithProviders(<Settings />);
    expect(screen.queryByText('Темная тема')).not.toBeInTheDocument();
  });

  test('opens the popup on button click', () => {
    renderWithProviders(<Settings />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Темная тема')).toBeInTheDocument();
  });

  test('closes the popup when clicking outside', () => {
    renderWithProviders(<Settings />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Темная тема')).toBeInTheDocument();

    fireEvent.click(document.body);
    expect(screen.queryByText('Темная тема')).not.toBeInTheDocument();
  });
});