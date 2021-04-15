import MenuButton from './MenuButton';
import React from 'react';
import { ReloadIcon } from '../Icons';
import { bem } from '../../utils/bem';

import './ReloadButton.scss';

const b = bem('reload-button');

interface ReloadButtonProps {
  isSelected: boolean;
  isActive: boolean;
  isError: boolean;
  count: number;
  onClick: () => void;
  onUpdate: () => void;
}

function ReloadButton({ isSelected, count, isActive, isError, onUpdate, onClick } : ReloadButtonProps) {
  return (
    <div className={`${b.block()} ${isActive ? 'reload-button_active' : ''}`}>
      <button className={`${b.element('icon')} ${isActive ? `${b.element('icon', 'active')}` : ''} ${isError ? `${b.element('icon', 'error')}` : ''}`} onClick={onUpdate}><ReloadIcon /></button>
      <MenuButton title={'Свежее'} isSelected={isSelected} count={count} onClick={onClick} />
    </div>
  );
}

export default ReloadButton;
