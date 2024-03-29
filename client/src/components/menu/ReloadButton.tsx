import React from 'react';
import { MenuButton } from './MenuButton';
import { ReloadIcon } from '../Icons';
import { Bem } from '../../utils/bem';

import './ReloadButton.scss';

const block = new Bem('reload-button');

interface ReloadButtonProps {
  isSelected: boolean;
  isActive: boolean;
  isError: boolean;
  count: number;
  onClick: () => void;
  onUpdate: () => void;
}

export function ReloadButton({
  isSelected,
  count,
  isActive,
  isError,
  onUpdate,
  onClick,
}: ReloadButtonProps): JSX.Element {
  const blockClass = block.addModifier(isActive ? 'active' : '').toString();
  const buttonClass = block
    .getElement('icon')
    .addModifier(isActive ? 'active' : '')
    .addModifier(isError ? 'error' : '')
    .toString();

  return (
    <div className={blockClass}>
      <button className={buttonClass} onClick={onUpdate}>
        <ReloadIcon />
      </button>
      <MenuButton
        title={'Свежее'}
        isSelected={isSelected}
        count={count}
        onClick={onClick}
      />
    </div>
  );
}
