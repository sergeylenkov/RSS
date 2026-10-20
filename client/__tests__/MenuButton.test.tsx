import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuButton } from '../src/components/menu/MenuButton';

describe('MenuButton', () => {
  test('renders the title', () => {
    render(<MenuButton title={'Test'} isSelected={false} count={10} onClick={jest.fn()} />);

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('shows the counter when selected', () => {
    render(<MenuButton title={'Test'} isSelected count={10} onClick={jest.fn()} />);

    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('does not show the counter when not selected', () => {
    render(<MenuButton title={'Test'} isSelected={false} count={10} onClick={jest.fn()} />);

    expect(screen.queryByText('10')).not.toBeInTheDocument();
  });

  test('calls onClick when not selected', () => {
    const onClick = jest.fn();
    render(<MenuButton title={'Test'} isSelected={false} count={0} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when already selected', () => {
    const onClick = jest.fn();
    render(<MenuButton title={'Test'} isSelected count={0} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });
});