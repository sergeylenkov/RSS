import React from 'react';
import { connect } from 'react-redux';
import { toggleTheme, toggleCollapseLong, updateKeepDays } from '../../store/actions';
import { Dispatch } from "redux";

import styles from './Settings.module.css';

interface MapStateToProps {
  isDarkTheme: boolean;
  isCollapseLong: boolean;
  keepDays: number;
  toggleTheme: (isDarkTheme: boolean) => void;
  toggleCollapseLong: (isCollapseLong: boolean) => void;
  updateKeepDays: (days: number) => void;
}

interface SettingsProps extends MapStateToProps {
  isVisible: boolean;
}

class Settings extends React.Component<SettingsProps> {

  private collapseId = '0';
  private themeId = '1';
  private collapseFieldRef = React.createRef<HTMLInputElement>();
  private daysFieldRef = React.createRef<HTMLInputElement>();
  private themeFieldRef = React.createRef<HTMLInputElement>();

  onToggleCollapse() {
    const { isCollapseLong, toggleCollapseLong } = this.props;
    toggleCollapseLong(!isCollapseLong);
  }

  onChangeDays() {
    const { updateKeepDays } = this.props;
    const days = parseInt(this.daysFieldRef.current!.value);

    updateKeepDays(days);
  }

  onToggleTheme() {
    const { isDarkTheme, toggleTheme } = this.props;
    toggleTheme(!isDarkTheme);
  }

  onClick(e: any) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { isVisible, isDarkTheme, isCollapseLong, keepDays } = this.props;

    if (!isVisible) {
      return null;
    }

    return (
      <div className={styles.container} onClick={this.onClick}>
        <div className={styles.item}>
          <input id={this.themeId} className={styles.checkbox} ref={this.themeFieldRef} type="checkbox" checked={isDarkTheme} onChange={this.onToggleTheme} />
          <label className={styles.label} htmlFor={this.themeId}>Темная тема</label>
        </div>

        <div className={styles.item}>
          <input id={this.collapseId} className={styles.checkbox} ref={this.collapseFieldRef} type="checkbox" checked={isCollapseLong} onChange={this.onToggleCollapse} />
          <label className={styles.label} htmlFor={this.collapseId}>Сворачивать длинные посты</label>
        </div>

        <div className={styles.item}>
          <div className={styles.label}>
            Удалять посты старше <input className={styles.days} ref={this.daysFieldRef} type="text" value={keepDays} onChange={this.onChangeDays}/> дней
          </div>
        </div>
      </div>
    );
  }
}

/* Redux */

const mapStateToProps = (state: MapStateToProps) => {
  return {
    isDarkTheme: state.isDarkTheme,
    isCollapseLong: state.isCollapseLong
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    toggleTheme: (isDarkTheme: boolean) => dispatch(toggleTheme(isDarkTheme)),
    toggleCollapseLong: (isCollapse: boolean) => dispatch(toggleCollapseLong(isCollapse)),
    updateKeepDays: (days: number) => dispatch(updateKeepDays(days))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
