import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { Menu } from '../src/components/menu/Menu';

describe('Menu', () => {
  test('renders all menu items', () => {
    renderWithProviders(<Menu />, { useRouter: true });

    expect(screen.getByText('Свежее')).toBeInTheDocument();
    expect(screen.getByText('Все')).toBeInTheDocument();
    expect(screen.getByText('Прочитанное')).toBeInTheDocument();
    expect(screen.getByText('Избранное')).toBeInTheDocument();
  });

  test('marks the current route item as selected', () => {
    const { container } = renderWithProviders(<Menu />, {
      useRouter: true,
      route: '/all',
    });

    const selected = container.querySelector('.menu-button__label_selected');
    expect(selected).toHaveTextContent('Все');
  });

  test('navigates on item click', () => {
    const { container } = renderWithProviders(<Menu />, { useRouter: true });

    fireEvent.click(screen.getByText('Избранное'));

    const selected = container.querySelector('.menu-button__label_selected');
    expect(selected).toHaveTextContent('Избранное');
  });
});
