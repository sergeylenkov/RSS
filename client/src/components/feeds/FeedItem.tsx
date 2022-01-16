import React, { useRef } from 'react';
import { Bem } from '../../utils/bem';
import { CheckmarkIcon, TrashIcon } from '../Icons';

import './FeedItem.scss';

const block = new Bem('feed-item');

interface FeedProps {
  id: number;
  icon: string;
  title: string;
  count: number;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onChange: (id: number, title: string) => void;
}

function FeedItem({
  id,
  icon,
  title,
  count,
  isEditing,
  isSelected,
  onSelect,
  onDelete,
  onChange,
}: FeedProps): JSX.Element {
  const titleFieldRef = useRef<HTMLInputElement>(null);

  const onChangeTitle = (): void => {
    if (titleFieldRef && titleFieldRef.current) {
      onChange(id, titleFieldRef.current.value.trim());
    }
  };

  const labelClass = block
    .getElement('label')
    .addModifier(isSelected ? 'selected' : '')
    .toString();
  const counterClass = block.getElement('counter').toString();
  const iconClass = block.getElement('icon').toString();

  return (
    <div className={block.toString()}>
      {isEditing ? (
        <div className="feed-item__edit_panel">
          <div
            className={iconClass}
            style={{ backgroundImage: `url(${icon})` }}
          />
          <input
            ref={titleFieldRef}
            className="feed-item__title_field"
            defaultValue={title}
            type="text"
          />
          <button className="feed-item__edit_button" onClick={onChangeTitle}>
            <div className="icon">
              <CheckmarkIcon />
            </div>
          </button>
          <button
            className="feed-item__edit_button"
            onClick={() => onDelete(id)}
          >
            <div className="icon">
              <TrashIcon />
            </div>
          </button>
        </div>
      ) : (
        <button
          className={block.getElement('button').toString()}
          onClick={() => onSelect(id)}
        >
          <div
            className={iconClass}
            style={{ backgroundImage: `url(${icon})` }}
          />
          <div className={labelClass}>{title}</div>
          <div className={counterClass}>{count}</div>
        </button>
      )}
    </div>
  );
}

export default FeedItem;
