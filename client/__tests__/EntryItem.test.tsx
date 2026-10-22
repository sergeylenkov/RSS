import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Feed, Entry } from '../src/data';
import { EntryItemRef } from '../src/components/entries/EntryItem';

const feed: Feed = {
  id: 1,
  title: 'Mock feed',
  link: 'https://www.test.com',
  image: '',
  icon: '',
  count: 1,
  iconUrl: '',
};

const createEntry = (overrides: Partial<Entry> = {}): Entry => ({
  id: 1,
  title: 'Mock entry',
  description: '<div>Short description</div>',
  link: 'https://www.test.com/1',
  isViewed: false,
  isFavorite: false,
  isRead: false,
  feed,
  feedId: 1,
  ...overrides,
});

const longDescription = '<img></img><img></img><img></img><img></img>';

describe('EntryItem', () => {
  test('renders title, feed title and description', () => {
    render(
      <EntryItemRef
        entry={createEntry()}
        isCollapseLong={false}
        onSetRead={jest.fn()}
        onSetFavorite={jest.fn()}
      />
    );

    expect(screen.getByText('Mock entry')).toBeInTheDocument();
    expect(screen.getByText('Mock feed')).toBeInTheDocument();
    expect(screen.getByText('Short description')).toBeInTheDocument();
  });

  test('renders link with the entry url', () => {
    render(
      <EntryItemRef
        entry={createEntry()}
        isCollapseLong={false}
        onSetRead={jest.fn()}
        onSetFavorite={jest.fn()}
      />
    );

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://www.test.com/1'
    );
  });

  test('does not collapse short entries', () => {
    const { container } = render(
      <EntryItemRef
        entry={createEntry()}
        isCollapseLong={false}
        onSetRead={jest.fn()}
        onSetFavorite={jest.fn()}
      />
    );

    expect(container.querySelector('.entry-item')).not.toHaveClass(
      'entry-item_collapsed'
    );
    expect(
      container.querySelector('.entry-item-expand-button')
    ).not.toBeInTheDocument();
  });

  test('collapses long entries when isCollapseLong = true', () => {
    const { container } = render(
      <EntryItemRef
        entry={createEntry({ description: longDescription })}
        isCollapseLong
        onSetRead={jest.fn()}
        onSetFavorite={jest.fn()}
      />
    );

    expect(container.querySelector('.entry-item')).toHaveClass(
      'entry-item_collapsed'
    );
  });

  test('does not collapse long entries when isCollapseLong = false', () => {
    const { container } = render(
      <EntryItemRef
        entry={createEntry({ description: longDescription })}
        isCollapseLong={false}
        onSetRead={jest.fn()}
        onSetFavorite={jest.fn()}
      />
    );

    expect(container.querySelector('.entry-item')).not.toHaveClass(
      'entry-item_collapsed'
    );
  });

  test('expands a collapsed entry and marks it as read', () => {
    const onSetRead = jest.fn();
    const { container } = render(
      <EntryItemRef
        entry={createEntry({ description: longDescription })}
        isCollapseLong
        onSetRead={onSetRead}
        onSetFavorite={jest.fn()}
      />
    );

    fireEvent.click(
      container.querySelector('.entry-item-expand-button') as Element
    );

    expect(container.querySelector('.entry-item')).not.toHaveClass(
      'entry-item_collapsed'
    );
    expect(onSetRead).toHaveBeenCalledWith(1, true);
  });

  test('toggles favorite on favorite icon click', () => {
    const onSetFavorite = jest.fn();
    const { container } = render(
      <EntryItemRef
        entry={createEntry({ isFavorite: false })}
        isCollapseLong={false}
        onSetRead={jest.fn()}
        onSetFavorite={onSetFavorite}
      />
    );

    fireEvent.click(
      container.querySelector('.entry-item-info__icon') as Element
    );

    expect(onSetFavorite).toHaveBeenCalledWith(1, true);
  });

  test('shows unread control when entry is read', () => {
    const { container } = render(
      <EntryItemRef
        entry={createEntry({ isRead: true })}
        isCollapseLong={false}
        onSetRead={jest.fn()}
        onSetFavorite={jest.fn()}
      />
    );

    expect(container.querySelectorAll('.entry-item-info__item')).toHaveLength(
      2
    );
  });
});
