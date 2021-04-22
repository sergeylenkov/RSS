import React, { useEffect, useRef, useState } from 'react';
import { FavoriteIcon, FavoriteSelectedIcon, ReadIcon } from '../Icons';
import { Entry } from '../../data';
import { debounce } from '../../utils';
import { isLong, removeSelfLinks } from '../../utils/entry';
import { Bem } from '../../utils/bem';

import './EntryItem.scss';

const block = new Bem('entry-item');
const feedBlock = new Bem('entry-item-feed');
const infoBlock = new Bem('entry-item-info');

interface EntryProps {
  entry: Entry;
  isCollapseLong: boolean;
  onView: (id: number) => void;
  onSetRead: (id: number, isRead: boolean) => void;
  onSetFavorite: (id: number, isRead: boolean) => void;
}

function EntryItem({ entry, isCollapseLong, onView, onSetRead, onSetFavorite }: EntryProps): JSX.Element {
  const [isExpanded, setExpanded] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    if (!entry.isViewed && itemRef && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const height = window.innerHeight / 2;

      let isViewed = false;
      let scrollEnd = false;

      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        scrollEnd = true;
      }

      if ((scrollEnd && rect.top > 0) || (rect.top < height)) {
        isViewed = true;
      }

      if (isViewed) {
        onView(entry.id);
      }
    }
  }

  const onScrollDebounce = debounce(() => {
    onScroll();
  }, 500, false)

  const onMouseMove = () => {
    if (!entry.isViewed && itemRef && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const height = rect.top + rect.height;

      if (height < window.innerHeight) {
        onView(entry.id);
      }

      window.removeEventListener('mousemove', onMouseMove);
    }
  }

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

    if (!entry.isViewed) {
      window.addEventListener('scroll', onScrollDebounce);
      window.addEventListener('mousemove', onMouseMove);
    }

    if (element) {
      element.addEventListener('mouseup', onRead);
    }

    return () => {
      window.removeEventListener('scroll', onScrollDebounce);
      window.removeEventListener('mousemove', onMouseMove);

      if (element) {
        element.removeEventListener('mouseup', onRead);
      }
    }
  }, [entry.isViewed]);

  const description = removeSelfLinks(entry.description, entry.link);
  const isCollapsed = isCollapseLong && !isExpanded && isLong(description);
  const blockClass = block.addModifier(isCollapsed ? 'collapsed' : undefined).build();

  return (
    <div ref={itemRef} className={blockClass}>
      <div ref={titleRef} className={block.getElement('title').build()}>
        <a href={entry.link}>{entry.title}</a>
      </div>
      <div className={feedBlock.build()}>
        <div className={feedBlock.getElement('icon').build()} style={{ backgroundImage: `url(${entry.feed.icon})` }} />
        <div className={feedBlock.getElement('title').build()}>{entry.feed.title}</div>
      </div>
      <div className={block.getElement('description').build()} dangerouslySetInnerHTML={{ __html: description }} />
      { isCollapsed && <button className='entry__expandButton' onClick={onExpand} />}
      <div className={infoBlock.build()}>
        <div className={infoBlock.getElement('item').build()}>
          <div className={infoBlock.getElement('icon').build()} onClick={onClickFavorite}>
            {entry.isFavorite ? <FavoriteSelectedIcon /> : <FavoriteIcon /> }
          </div>
        </div>
        { entry.isRead &&
          <div className={infoBlock.getElement('item').build()} onClick={onUnread}>
            <div className={infoBlock.getElement('icon').build()}><ReadIcon /></div>
          </div>
        }
      </div>
    </div>
  );
}

export default EntryItem;
