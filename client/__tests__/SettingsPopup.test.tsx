import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { SettingsPopup } from '../src/components/settings/SettingsPopup';

describe('SettingsPopup', () => {
  test('renders nothing when isVisible = false', () => {
    const { container } = renderWithProviders(
      <SettingsPopup isVisible={false} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('renders settings labels when isVisible = true', () => {
    renderWithProviders(<SettingsPopup isVisible />);

    expect(screen.getByText('Темная тема')).toBeInTheDocument();
    expect(screen.getByText('Сворачивать длинные посты')).toBeInTheDocument();
    expect(screen.getByText('Показывать лентой')).toBeInTheDocument();
    expect(screen.getByText(/Удалять посты старше/)).toBeInTheDocument();
  });

  test('renders three checkboxes', () => {
    renderWithProviders(<SettingsPopup isVisible />);

    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });

  test('toggles theme checkbox on click', () => {
    renderWithProviders(<SettingsPopup isVisible />);

    const themeCheckbox = screen.getByLabelText('Темная тема') as HTMLInputElement;
    const initial = themeCheckbox.checked;

    fireEvent.click(themeCheckbox);

    expect(themeCheckbox.checked).toBe(!initial);
  });

  test('renders a days input', () => {
    renderWithProviders(<SettingsPopup isVisible />);

    const daysInput = screen.getByRole('textbox') as HTMLInputElement;

    expect(daysInput).toBeInTheDocument();
    expect(daysInput.value).not.toBe('');
  });
});