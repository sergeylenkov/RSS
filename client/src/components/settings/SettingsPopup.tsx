import React, { forwardRef, MouseEvent, Ref, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  toggleTheme,
  toggleCollapseLong,
  updateKeepDays,
  toggleGrid,
} from '../../store/actions';
import { useAppDispatch } from '../../store/hooks';
import { State } from '../../store/reducers';
import { Bem } from '../../utils/bem';

import './SettingsPopup.scss';

const block = new Bem('settings');

function SettingsPopupContent(
  _props: unknown,
  ref: Ref<HTMLDivElement>
): React.JSX.Element {
  const collapseFieldRef = useRef<HTMLInputElement>(null);
  const daysFieldRef = useRef<HTMLInputElement>(null);
  const themeFieldRef = useRef<HTMLInputElement>(null);
  const gridFieldRef = useRef<HTMLInputElement>(null);
  const isDarkTheme = useSelector<State, boolean>((state) => state.isDarkTheme);
  const isCollapseLong = useSelector<State, boolean>(
    (state) => state.isCollapseLong
  );
  const isGrid = useSelector<State, boolean>((state) => state.isGrid);
  const keepDays = useSelector<State, number>((state) => state.keepDays);
  const dispatch = useAppDispatch();
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

  const itemClass = block.getElement('item').toString();
  const labelClass = block.getElement('label').toString();
  const checkboxClass = block.getElement('checkbox').toString();

  return (
    <div ref={ref} className={block.toString()} onClick={onClick}>
      <div className={itemClass}>
        <input
          ref={themeFieldRef}
          id={themeId}
          className={checkboxClass}
          type="checkbox"
          checked={Boolean(isDarkTheme)}
          onChange={onToggleTheme}
        />
        <label className={labelClass} htmlFor={themeId}>
          Темная тема
        </label>
      </div>

      <div className={itemClass}>
        <input
          ref={collapseFieldRef}
          id={collapseId}
          className={checkboxClass}
          type="checkbox"
          checked={Boolean(isCollapseLong)}
          onChange={onToggleCollapse}
        />
        <label className={labelClass} htmlFor={collapseId}>
          Сворачивать длинные посты
        </label>
      </div>

      <div className={itemClass}>
        <input
          ref={gridFieldRef}
          id={gridId}
          className={checkboxClass}
          type="checkbox"
          checked={!isGrid}
          onChange={onToggleGrid}
        />
        <label className={labelClass} htmlFor={gridId}>
          Показывать лентой
        </label>
      </div>

      <div className={itemClass}>
        <div className={labelClass}>
          Удалять посты старше{' '}
          <input
            className={block.getElement('days').toString()}
            ref={daysFieldRef}
            type="text"
            value={keepDays === undefined || keepDays === null ? '' : keepDays}
            onChange={onChangeDays}
          />{' '}
          дней
        </div>
      </div>
    </div>
  );
}

export const SettingsPopup = forwardRef(SettingsPopupContent);
