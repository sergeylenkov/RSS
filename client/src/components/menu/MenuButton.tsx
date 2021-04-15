import React, { useCallback } from 'react';
import { bem } from '../../utils/bem';

import './MenuButton.scss';

const b = bem('menu-button');

interface MenuButtonProps {
  isSelected: boolean;
  count: number;
  title: string;
  onClick: () => void;
}

function MenuButton({ isSelected, count, title, onClick } : MenuButtonProps) {
  const onClickHandle = useCallback(() => {
    if (!isSelected) {
      onClick();
    }
  }, [isSelected]);

  return (
    <button className={b.block()} onClick={onClickHandle}>
      <div className={`${b.element('label')} ${isSelected ? `${b.element('label', 'selected')}` : ''}`}>{title}</div>
      {isSelected && <div className={b.element('counter')}>{count}</div>}
    </button>
  )
}

export default MenuButton;
