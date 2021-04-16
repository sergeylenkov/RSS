import React from 'react';
import { Bem } from '../../utils/bem';
import { SettingsIcon } from '../Icons';

import './SettingsButton.scss';

const block = new Bem('menu-button');

interface SettingsButtonProps {
  isActive: boolean;
  onClick: () => void;
}

function SettingsButton({ isActive, onClick } : SettingsButtonProps): JSX.Element {
  const blockClass = block.addModifier(isActive ? 'active' : '').build();
  const iconClass = block.getElement('icon').addModifier(isActive ? 'active' : '').build();

  return (
    <button className={blockClass} onClick={onClick}>
      <div className={iconClass}>
        <SettingsIcon />
      </div>
    </button>
  );
}

export default SettingsButton;
