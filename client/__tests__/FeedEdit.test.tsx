import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeedEdit } from '../src/components/feeds/FeedEdit';

const baseProps = {
  onEdit: jest.fn(),
  onAdd: jest.fn(),
};

describe('FeedEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders add and edit buttons by default', () => {
    render(<FeedEdit {...baseProps} isEditing={false} />);

    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('calls onEdit when clicking the edit button', () => {
    render(<FeedEdit {...baseProps} isEditing={false} />);

    fireEvent.click(screen.getAllByRole('button')[1]);

    expect(baseProps.onEdit).toHaveBeenCalledTimes(1);
  });

  test('opens form with input when clicking add button', () => {
    render(<FeedEdit {...baseProps} isEditing={false} />);

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(screen.getByPlaceholderText('ссылка на канал')).toBeInTheDocument();
  });

  test('calls onAdd with the entered link', () => {
    render(<FeedEdit {...baseProps} isEditing={false} />);

    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.change(screen.getByPlaceholderText('ссылка на канал'), {
      target: { value: 'https://www.test.com/rss' },
    });
    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(baseProps.onAdd).toHaveBeenCalledWith('https://www.test.com/rss');
  });

  test('does not call onAdd for empty link', () => {
    render(<FeedEdit {...baseProps} isEditing={false} />);

    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(baseProps.onAdd).not.toHaveBeenCalled();
  });

  test('closes form when clicking the close button', () => {
    render(<FeedEdit {...baseProps} isEditing={false} />);

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByPlaceholderText('ссылка на канал')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(screen.queryByPlaceholderText('ссылка на канал')).not.toBeInTheDocument();
  });

  test('adds disabled and scrolled modifiers', () => {
    const { container } = render(
      <FeedEdit {...baseProps} isEditing={false} isDisabled isScrolled />
    );

    expect(container.querySelector('.feed-edit')).toHaveClass(
      'feed-edit',
      'feed-edit_disabled',
      'feed-edit_scrolled'
    );
  });
});