import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsButton } from '../src/components/settings/SettingsButton';

describe('SettingsButton', () => {
  test('renders a button', () => {
    render(<SettingsButton isActive={false} onClick={jest.fn()} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('adds active modifier when isActive = true', () => {
    const { container } = render(
      <SettingsButton isActive onClick={jest.fn()} />
    );

    expect(container.querySelector('.settings-button')).toHaveClass(
      'settings-button',
      'settings-button_active'
    );
  });

  test('does not add active modifier when isActive = false', () => {
    const { container } = render(
      <SettingsButton isActive={false} onClick={jest.fn()} />
    );

    expect(container.querySelector('.settings-button')).not.toHaveClass(
      'settings-button_active'
    );
  });

  test('calls onClick on click', () => {
    const onClick = jest.fn();
    render(<SettingsButton isActive={false} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
