import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import { SettingsPopup } from '../src/components/settings/SettingsPopup';

describe('SettingsPopup', () => {
  test('renders settings labels', () => {
    renderWithProviders(<SettingsPopup />);

    expect(screen.getByText('Темная тема')).toBeInTheDocument();
    expect(screen.getByText('Сворачивать длинные посты')).toBeInTheDocument();
    expect(screen.getByText('Показывать лентой')).toBeInTheDocument();
    expect(screen.getByText(/Удалять посты старше/)).toBeInTheDocument();
  });

  test('renders three checkboxes', () => {
    renderWithProviders(<SettingsPopup />);

    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
  });

  test('toggles theme checkbox on click', () => {
    renderWithProviders(<SettingsPopup />);

    const themeCheckbox = screen.getByLabelText('Темная тема') as HTMLInputElement;
    const initial = themeCheckbox.checked;

    fireEvent.click(themeCheckbox);

    expect(themeCheckbox.checked).toBe(!initial);
  });

  test('renders a days input', () => {
    renderWithProviders(<SettingsPopup />);

    const daysInput = screen.getByRole('textbox') as HTMLInputElement;

    expect(daysInput).toBeInTheDocument();
    expect(daysInput.value).not.toBe('');
  });

  test('forwards ref to the root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderWithProviders(<SettingsPopup ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});