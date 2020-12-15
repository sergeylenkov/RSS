import React from 'react';
import { SettingsIcon } from '../Icons';

import './Button.scss';

interface SettingsButtonProps {
  isActive: boolean;
  onClick: () => void;
}

class SettingsButton extends React.Component<SettingsButtonProps> {
  public render() {
    const { isActive, onClick } = this.props;

    return (
      <button className={`settings_button__container ${isActive ? 'settings_button__container--active' : ''}`} onClick={onClick}>
        <div className={`settings_button__icon ${isActive ? 'settings_button__icon--active' : ''}`}>
          <SettingsIcon />
        </div>
      </button>
    );
  }
}

export default SettingsButton;
