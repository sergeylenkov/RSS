import React, { forwardRef, Ref, useEffect, useRef, useState } from 'react';
import { FavoriteIcon, FavoriteSelectedIcon, ReadIcon } from '../Icons';
import { Entry } from '../../data';
import { isLong, removeSelfLinks } from '../../utils/entry';
import { Bem } from '../../utils/bem';

import './EntryItem.scss';

const block = new Bem('entry-item');
const feedBlock = new Bem('entry-item-feed');
const infoBlock = new Bem('entry-item-info');

interface EntryProps {
  entry: Entry;
  isCollapseLong: boolean;
  onSetRead: (id: number, isRead: boolean) => void;
  onSetFavorite: (id: number, isRead: boolean) => void;
}

export function EntryItem(
  { entry, isCollapseLong, onSetRead, onSetFavorite }: EntryProps,
  ref: Ref<HTMLDivElement>
): JSX.Element {
  const [isExpanded, setExpanded] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  const onExpand = () => {
    setExpanded(true);
    onRead();
  };

  const onRead = () => {
    if (!entry.isRead) {
      onSetRead(entry.id, true);
    }
  };

  const onUnread = () => {
    onSetRead(entry.id, false);
  };

  const onClickFavorite = () => {
    onSetFavorite(entry.id, !entry.isFavorite);
  };

  useEffect(() => {
    const element = titleRef.current;

    if (!entry.isRead) {
      if (element) {
        element.addEventListener('mouseup', onRead);
      }
    }

    return () => {
      element && element.removeEventListener('mouseup', onRead);
    };
  }, [entry.isRead]);

  const description = removeSelfLinks(entry.description, entry.link);
  const isCollapsed = isCollapseLong && !isExpanded && isLong(description);
  const blockClass = block
    .addModifier(isCollapsed ? 'collapsed' : '')
    .toString();

  return (
    <div ref={ref} className={blockClass}>
      <div ref={titleRef} className={block.getElement('title').toString()}>
        <a href={entry.link}>{entry.title}</a>
      </div>
      <div className={feedBlock.toString()}>
        <div
          className={feedBlock.getElement('icon').toString()}
          style={{ backgroundImage: `url(${entry.feed.icon})` }}
        />
        <div className={feedBlock.getElement('title').toString()}>
          {entry.feed.title}
        </div>
      </div>
      <div
        className={block.getElement('description').toString()}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      {isCollapsed && (
        <button className="entry-item-expand-button" onClick={onExpand} />
      )}
      <div className={infoBlock.toString()}>
        <div className={infoBlock.getElement('item').toString()}>
          <div
            className={infoBlock.getElement('icon').toString()}
            onClick={onClickFavorite}
          >
            {entry.isFavorite ? <FavoriteSelectedIcon /> : <FavoriteIcon />}
          </div>
        </div>
        {entry.isRead && (
          <div
            className={infoBlock.getElement('item').toString()}
            onClick={onUnread}
          >
            <div className={infoBlock.getElement('icon').toString()}>
              <ReadIcon />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const EntryItemRef = forwardRef(EntryItem);
