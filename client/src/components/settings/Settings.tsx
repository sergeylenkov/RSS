import React, { MouseEvent } from 'react';
import { connect } from 'react-redux';
import { toggleTheme, toggleCollapseLong, updateKeepDays, toggleGrid } from '../../store/actions';
import { Dispatch } from 'redux';

import './Settings.scss';

interface MapStateToProps {
  isDarkTheme: boolean;
  isCollapseLong: boolean;
  keepDays: number;
  isGrid: boolean;
  toggleTheme: (isDarkTheme: boolean) => void;
  toggleCollapseLong: (isCollapseLong: boolean) => void;
  updateKeepDays: (days: number) => void;
  toggleGrid: (isGrid: boolean) => void;
}

interface SettingsProps extends MapStateToProps {
  isVisible: boolean;
}

class Settings extends React.Component<SettingsProps> {
  private collapseId = '0';
  private themeId = '1';
  private gridId = '2';
  private collapseFieldRef = React.createRef<HTMLInputElement>();
  private daysFieldRef = React.createRef<HTMLInputElement>();
  private themeFieldRef = React.createRef<HTMLInputElement>();
  private gridFieldRef = React.createRef<HTMLInputElement>();

  onToggleCollapse = () => {
    const { isCollapseLong, toggleCollapseLong } = this.props;
    toggleCollapseLong(!isCollapseLong);
  };

  onChangeDays = () => {
    const { updateKeepDays } = this.props;
    const days = parseInt(this.daysFieldRef.current!.value);

    updateKeepDays(days);
  };

  onToggleTheme = () => {
    const { isDarkTheme, toggleTheme } = this.props;
    toggleTheme(!isDarkTheme);
  };

  onToggleGrid = () => {
    const { isGrid, toggleGrid } = this.props;
    toggleGrid(!isGrid);
  };

  onClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  render() {
    const { isVisible, isDarkTheme, isCollapseLong, keepDays, isGrid } = this.props;

    if (!isVisible) {
      return null;
    }

    return (
      <div className='settings__container' onClick={this.onClick}>
        <div className='settings__item'>
          <input id={this.themeId} className='settings__checkbox' ref={this.themeFieldRef} type="checkbox" checked={isDarkTheme} onChange={this.onToggleTheme} />
          <label className='settings__label' htmlFor={this.themeId}>Темная тема</label>
        </div>

        <div className='settings__item'>
          <input id={this.collapseId} className='settings__checkbox' ref={this.collapseFieldRef} type="checkbox" checked={isCollapseLong} onChange={this.onToggleCollapse} />
          <label className='settings__label' htmlFor={this.collapseId}>Сворачивать длинные посты</label>
        </div>

        <div className='settings__item'>
          <input id={this.gridId} className='settings__checkbox' ref={this.gridFieldRef} type="checkbox" checked={!isGrid} onChange={this.onToggleGrid} />
          <label className='settings__label' htmlFor={this.gridId}>Показывать лентой</label>
        </div>

        <div className='settings__item'>
          <div className='settings__label'>
            Удалять посты старше <input className='settings__days' ref={this.daysFieldRef} type="text" value={keepDays} onChange={this.onChangeDays}/> дней
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
    isCollapseLong: state.isCollapseLong,
    keepDays: state.keepDays,
    isGrid: state.isGrid
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    toggleTheme: (isDarkTheme: boolean) => dispatch(toggleTheme(isDarkTheme)),
    toggleCollapseLong: (isCollapse: boolean) => dispatch(toggleCollapseLong(isCollapse)),
    updateKeepDays: (days: number) => dispatch(updateKeepDays(days)),
    toggleGrid: (isGrid: boolean) => dispatch(toggleGrid(isGrid))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
