import React, { useRef, useState } from 'react';
import { Bem } from '../../utils/bem';
import { CheckmarkIcon, CloseIcon, AddIcon, EditIcon } from '../Icons';

import './FeedEdit.scss';

const block = new Bem('feed-edit');
const fromBlock = new Bem('feed-edit-form');

interface FeedEditProps {
  isEditing: boolean;
  isDisabled?: boolean;
  isScrolled?: boolean;
  onEdit: () => void;
  onAdd: (link: string) => void;
}

export function FeedEdit({
  isDisabled,
  isScrolled,
  isEditing,
  onEdit,
  onAdd,
}: FeedEditProps): JSX.Element {
  const [isFormVisible, setFormVisible] = useState(false);
  const linkFieldRef = useRef<HTMLInputElement>(null);

  const onAddClick = () => {
    if (linkFieldRef && linkFieldRef.current) {
      const value = linkFieldRef.current.value;

      if (value.length > 0) {
        onAdd(value);
      }
    }
  };

  const blockClass = block
    .addModifier(isDisabled ? 'disabled' : '')
    .addModifier(isScrolled ? 'scrolled' : '')
    .toString();
  const iconClass = block.getElement('icon').toString();
  const editIconClass = block
    .getElement('icon')
    .addModifier(isEditing ? 'editing' : '')
    .toString();
  const buttonClass = block.getElement('button').toString();
  const formButtonClass = fromBlock.getElement('button').toString();

  if (isFormVisible) {
    return (
      <div className={blockClass}>
        <div className={fromBlock.toString()}>
          <input
            ref={linkFieldRef}
            className={fromBlock.getElement('field').toString()}
            placeholder="ссылка на канал"
            type="text"
          />
          <button className={formButtonClass} onClick={onAddClick}>
            <div className={iconClass}>
              <CheckmarkIcon />
            </div>
          </button>
          <button
            className={formButtonClass}
            onClick={() => setFormVisible(false)}
          >
            <div className={iconClass}>
              <CloseIcon />
            </div>
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={blockClass}>
        <button className={buttonClass} onClick={() => setFormVisible(true)}>
          <div className={iconClass}>
            <AddIcon />
          </div>
        </button>
        <button className={buttonClass} onClick={onEdit}>
          <div className={editIconClass}>
            <EditIcon />
          </div>
        </button>
      </div>
    );
  }
}
