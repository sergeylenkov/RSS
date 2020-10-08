import React from 'react';
import { connect } from 'react-redux';
import { SettingsIcon } from '../Icons';

import lightStyles from './Button.module.css';
import darkStyles from './Button.dark.module.css';

interface MapStateToProps {
  isDarkTheme: boolean;
}

interface SettingsButtonProps extends MapStateToProps {
  isActive: boolean;
  onClick: () => void;
}

class SettingsButton extends React.Component<SettingsButtonProps> {
  public render() {
    const { isDarkTheme, isActive, onClick } = this.props;

    let styles = lightStyles;

    if (isDarkTheme) {
      styles = {...lightStyles, ...darkStyles};
    }

    return (
      <button className={`${styles.container} ${isActive ? styles.active : ''}`} onClick={onClick}>
        <div className={styles.icon}><SettingsIcon /></div>
      </button>
    );
  }
}

/* Redux */

const mapStateToProps = (state: SettingsButtonProps) => {
  return {
    isDarkTheme: state.isDarkTheme
  };
};

export default connect(mapStateToProps)(SettingsButton);
