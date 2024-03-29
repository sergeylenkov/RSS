import React, { MouseEvent } from 'react';
import { Bem } from '../../utils/bem';
import { SettingsIcon } from '../Icons';

import './SettingsButton.scss';

const block = new Bem('settings-button');

interface SettingsButtonProps {
  isActive: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function SettingsButton({
  isActive,
  onClick,
}: SettingsButtonProps): JSX.Element {
  const blockClass = block.addModifier(isActive ? 'active' : '').toString();
  const iconClass = block
    .getElement('icon')
    .addModifier(isActive ? 'active' : '')
    .toString();

  return (
    <button className={blockClass} onClick={onClick}>
      <div className={iconClass}>
        <SettingsIcon />
      </div>
    </button>
  );
}
