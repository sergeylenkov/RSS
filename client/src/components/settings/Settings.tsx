import React, { MouseEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, toggleCollapseLong, updateKeepDays, toggleGrid } from '../../store/actions';
import { State } from '../../store/reducers';
import { Bem } from '../../utils/bem';

import './Settings.scss';

const block = new Bem('settings');

interface SettingsProps {
  isVisible: boolean;
}

function Settings({ isVisible }: SettingsProps): JSX.Element | null {
  const collapseFieldRef = useRef<HTMLInputElement>(null);
  const daysFieldRef = useRef<HTMLInputElement>(null);
  const themeFieldRef = useRef<HTMLInputElement>(null);
  const gridFieldRef = useRef<HTMLInputElement>(null);
  const isDarkTheme = useSelector<State, boolean>(state => state.isDarkTheme);
  const isCollapseLong = useSelector<State, boolean>(state => state.isCollapseLong);
  const isGrid = useSelector<State, boolean>(state => state.isGrid);
  const keepDays = useSelector<State, number>(state => state.keepDays);
  const dispatch = useDispatch();
  const collapseId = '0';
  const themeId = '1';
  const gridId = '2';

  const onToggleCollapse = () => {
    dispatch(toggleCollapseLong(!isCollapseLong));
  };

  const onChangeDays = () => {
    if (daysFieldRef && daysFieldRef.current) {
      const days = parseInt(daysFieldRef.current.value);
      dispatch(updateKeepDays(days));
    }
  };

  const onToggleTheme = () => {
    dispatch(toggleTheme(!isDarkTheme));
  };

  const onToggleGrid = () => {
    dispatch(toggleGrid(!isGrid));
  };

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  if (!isVisible) {
    return null;
  }

  const itemClass = block.getElement('item').toString();
  const labelClass = block.getElement('label').toString();
  const checkboxClass = block.getElement('checkbox').toString();

  return (
    <div className={block.toString()} onClick={onClick}>
      <div className={itemClass}>
        <input ref={themeFieldRef} id={themeId} className={checkboxClass} type="checkbox" checked={isDarkTheme} onChange={onToggleTheme} />
        <label className={labelClass} htmlFor={themeId}>Темная тема</label>
      </div>

      <div className={itemClass}>
        <input ref={collapseFieldRef} id={collapseId} className={checkboxClass} type="checkbox" checked={isCollapseLong} onChange={onToggleCollapse} />
        <label className={labelClass} htmlFor={collapseId}>Сворачивать длинные посты</label>
      </div>

      <div className={itemClass}>
        <input ref={gridFieldRef} id={gridId} className={checkboxClass} type="checkbox" checked={!isGrid} onChange={onToggleGrid} />
        <label className={labelClass} htmlFor={gridId}>Показывать лентой</label>
      </div>

      <div className={itemClass}>
        <div className={labelClass}>
          Удалять посты старше <input className={block.getElement('days').toString()} ref={daysFieldRef} type="text" value={keepDays} onChange={onChangeDays}/> дней
        </div>
      </div>
    </div>
  );
}

export default Settings;
