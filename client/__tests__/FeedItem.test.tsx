import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeedItem } from '../src/components/feeds/FeedItem';

const baseProps = {
  id: 1,
  icon: '',
  title: 'Test feed',
  count: 3,
  onSelect: jest.fn(),
  onChange: jest.fn(),
  onDelete: jest.fn(),
};

describe('FeedItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders title and counter when not editing', () => {
    render(<FeedItem {...baseProps} isEditing={false} isSelected={false} />);

    expect(screen.getByText('Test feed')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('adds selected modifier to the label', () => {
    const { container } = render(
      <FeedItem {...baseProps} isEditing={false} isSelected />
    );

    expect(container.querySelector('.feed-item__label')).toHaveClass(
      'feed-item__label_selected'
    );
  });

  test('calls onSelect with id when clicking the feed button', () => {
    render(<FeedItem {...baseProps} isEditing={false} isSelected={false} />);

    fireEvent.click(screen.getByRole('button'));

    expect(baseProps.onSelect).toHaveBeenCalledWith(1);
  });

  test('renders edit panel with input when editing', () => {
    render(<FeedItem {...baseProps} isEditing isSelected={false} />);

    expect(screen.getByRole('textbox')).toHaveValue('Test feed');
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  test('calls onChange with id and trimmed title', () => {
    render(<FeedItem {...baseProps} isEditing isSelected={false} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '  New title  ' },
    });
    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(baseProps.onChange).toHaveBeenCalledWith(1, 'New title');
  });

  test('calls onDelete with id', () => {
    render(<FeedItem {...baseProps} isEditing isSelected={false} />);

    fireEvent.click(screen.getAllByRole('button')[1]);

    expect(baseProps.onDelete).toHaveBeenCalledWith(1);
  });
});
