import MenuButton from './MenuButton';
import React from 'react';
import { ReloadIcon } from '../Icons';

import './ReloadButton.scss';

interface MapStateToProps {
}

interface ReloadButtonProps extends MapStateToProps {
  isSelected: boolean;
  isActive: boolean;
  isError: boolean;
  count: number;
  onClick: () => void;
  onUpdate: () => void;
}

class ReloadButton extends React.Component<ReloadButtonProps> {
  public render() {
    const { isSelected, count, isActive, isError, onUpdate, onClick } = this.props;

    return (
      <div className={`reload_button__container ${isActive ? 'reload_button__container--active' : ''}`}>
        <button className={`reload_button__icon ${isActive ? 'reload_button__icon--active' : ''} ${isError ? 'reload_button__icon--error' : ''}`} onClick={onUpdate}><ReloadIcon /></button>
        <MenuButton title={'Свежее'} isSelected={isSelected} count={count} onClick={onClick} />
      </div>
    );
  }
}

export default ReloadButton;
