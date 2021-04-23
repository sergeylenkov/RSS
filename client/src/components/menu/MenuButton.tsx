import React, { useCallback } from 'react';
import { Bem } from '../../utils/bem';

import './MenuButton.scss';

const block = new Bem('menu-button');

interface MenuButtonProps {
  isSelected: boolean;
  count: number;
  title: string;
  onClick: () => void;
}

function MenuButton({ isSelected, count, title, onClick } : MenuButtonProps): JSX.Element {
  const onClickHandle = useCallback(() => {
    if (!isSelected) {
      onClick();
    }
  }, [isSelected]);

  const blockClass = block.toString();
  const labelClass = block.getElement('label').addModifier(isSelected ? 'selected' : '').toString();
  const counterClass = block.getElement('counter').toString();

  return (
    <button className={blockClass} onClick={onClickHandle}>
      <div className={labelClass}>{title}</div>
      {isSelected && <div className={counterClass}>{count}</div>}
    </button>
  )
}

export default MenuButton;
