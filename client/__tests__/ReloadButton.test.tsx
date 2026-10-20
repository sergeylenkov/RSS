import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReloadButton } from '../src/components/menu/ReloadButton';

describe('ReloadButton', () => {
  const renderButton = (props: {
    isActive: boolean;
    isError: boolean;
    isSelected: boolean;
    onClick?: jest.Mock;
    onUpdate?: jest.Mock;
  }): ReturnType<typeof render> => {
    const { isActive, isError, isSelected } = props;
    const onClick = props.onClick ?? jest.fn();
    const onUpdate = props.onUpdate ?? jest.fn();

    return render(
      <ReloadButton
        isActive={isActive}
        isError={isError}
        isSelected={isSelected}
        count={10}
        onClick={onClick}
        onUpdate={onUpdate}
      />
    );
  };

  test('renders reload button and menu button', () => {
    renderButton({ isActive: true, isError: false, isSelected: false });

    expect(screen.getByText('Свежее')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  test('adds active modifier when isActive = true', () => {
    const { container } = renderButton({
      isActive: true,
      isError: false,
      isSelected: false,
    });

    expect(container.querySelector('.reload-button')).toHaveClass(
      'reload-button',
      'reload-button_active'
    );
  });

  test('adds error modifier when isError = true', () => {
    const { container } = renderButton({
      isActive: false,
      isError: true,
      isSelected: false,
    });

    expect(container.querySelector('.reload-button__icon')).toHaveClass(
      'reload-button__icon_error'
    );
  });

  test('shows counter when isSelected = true', () => {
    renderButton({ isActive: false, isError: false, isSelected: true });

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('calls onUpdate when clicking reload button', () => {
    const onUpdate = jest.fn();
    renderButton({
      isActive: false,
      isError: false,
      isSelected: false,
      onUpdate,
    });

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  test('calls onClick when clicking the feed menu button', () => {
    const onClick = jest.fn();
    renderButton({
      isActive: false,
      isError: false,
      isSelected: false,
      onClick,
    });

    fireEvent.click(screen.getByText('Свежее'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});