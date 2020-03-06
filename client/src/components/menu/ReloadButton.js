import { MenuButton } from './MenuButton.js';
import React from 'react';
import { ReloadIcon } from '../Icons.js';
import { connect } from 'react-redux';
import darkStyles from './ReloadButton.dark.module.css';
import lightStyles from './ReloadButton.module.css';

export class ConnectedReloadButton extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  render() {
    let styles = {};

    if (this.props.isDarkTheme) {
      styles = { ...lightStyles, ...darkStyles };
    } else {
      styles = lightStyles;
    }

    return (
      <div className={`${styles.container} ${this.props.isActive ? styles.active : ''} ${this.props.isError ? styles.error : ''}`}>
        <button className={styles.icon} onClick={this.onUpdate}><ReloadIcon /></button>
        <MenuButton title={'Свежее'} isSelected={this.props.isSelected} count={this.props.count} onClick={this.onClick} />
      </div>
    );
  }

  onClick() {
    if (!this.props.isSelected) {
      this.props.onClick();
    }
  }

  onUpdate() {
    this.props.onUpdate();
  }
}

/* Redux */

const mapStateToProps = state => {
  return {
    isDarkTheme: state.isDarkTheme,
  };
};


export const ReloadButton = connect(mapStateToProps)(ConnectedReloadButton);