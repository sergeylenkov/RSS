import React from 'react';
import { connect } from 'react-redux';

import lightStyles from './MenuButton.module.css';
import darkStyles from './MenuButton.dark.module.css';

interface MapStateToProps {
  isDarkTheme: boolean;
}

interface MenuButtonProps extends MapStateToProps {
  isSelected: boolean;
  count: number;
  title: string;
  onClick: () => void;
}

class MenuButton extends React.Component<MenuButtonProps> {
  public render() {
    const { isDarkTheme, isSelected, count, title } = this.props;
    const styles = isDarkTheme ? darkStyles : lightStyles;

    let counter;

    if (isSelected) {
      counter = <div className={styles.counter}>{count}</div>
    }

    return (
      <button className={`${styles.container} ${isSelected ? styles.selected : ''}`} onClick={this.onClick}>
        <div className={styles.label}>{title}</div>
        {counter}
      </button>
    )
  }

  private onClick() {
    const { isSelected, onClick } = this.props;

    if (!isSelected) {
      onClick();
    }
  }
}

/* Redux */

const mapStateToProps = (state: MapStateToProps) => {
  return {
    isDarkTheme: state.isDarkTheme
  };
};

export default connect(mapStateToProps)(MenuButton);
