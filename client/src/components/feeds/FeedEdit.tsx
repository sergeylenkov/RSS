import React, { useRef, useState } from 'react';
import { CheckmarkIcon, CloseIcon, AddIcon, EditIcon } from '../Icons';

import './FeedEdit.scss';

interface FeedEditProps {
  isEditing: boolean;
  isDisabled?: boolean;
  isScrolled?: boolean;
  onEdit: () => void;
  onAdd: (link: string) => void;
}

function FeedEdit({ isDisabled, isScrolled, isEditing, onEdit, onAdd } : FeedEditProps): JSX.Element {
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

  const className = `edit ${isDisabled ? 'edit_disabled' : ''} ${isScrolled ? 'edit_scrolled' : ''}`;

  if (isFormVisible) {
    return (
      <div className={className}>
        <div className='edit__form'>
          <input ref={linkFieldRef} className='edit__form__link_field' placeholder="ссылка на канал" type="text" />
          <button className='edit__form-button' onClick={onAddClick}><div className='edit__icon'><CheckmarkIcon /></div></button>
            <button className='edit__form-button' onClick={() => setFormVisible(false)}><div className='edit__icon'><CloseIcon /></div></button>
          </div>
        </div>
      );
  } else {
    return (
      <div className={className}>
        <button className='edit__button' onClick={() => setFormVisible(true)}><div className='edit__icon'><AddIcon /></div></button>
        <button className='edit__button' onClick={onEdit}><div className={`edit__icon ${isEditing ? 'edit__icon_editing' : ''}`}><EditIcon /></div></button>
      </div>
    );
  }
}

export default FeedEdit;
