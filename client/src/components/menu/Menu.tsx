import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MenuButton } from './MenuButton';
import { ReloadButton } from './ReloadButton';
import { Bem } from '../../utils/bem';
import { State } from '../../store/reducers';
import { Entry, update } from '../../data';
import {
  entriesUpdateError,
  entriesUpdated,
  entriesUpdating,
  updateUnviewedCount,
} from '../../store/actions';

import './Menu.scss';

const block = new Bem('menu');

export function Menu(): JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isUpdating = useSelector<State, boolean>((state) => state.isUpdating);
  const isUpdateError = useSelector<State, boolean>(
    (state) => state.isUpdateError
  );
  const unviewedCount = useSelector<State, number>(
    (state) => state.unviewedCount
  );
  const entriesCount = useSelector<State, number>(
    (state) => state.entriesCount
  );

  const onUpdate = useCallback(() => {
    dispatch(entriesUpdating(true));

    update()
      .then((entries: Entry[]) => {
        const unviewed = entries.filter((entry: Entry) => {
          return !entry.isViewed;
        });

        dispatch(entriesUpdated(unviewed));
        dispatch(updateUnviewedCount());
      })
      .catch(() => {
        dispatch(entriesUpdateError());
      });
  }, []);

  return (
    <div className={block.toString()}>
      <ReloadButton
        isActive={isUpdating}
        isSelected={pathname === '/'}
        isError={isUpdateError}
        count={unviewedCount}
        onUpdate={onUpdate}
        onClick={() => navigate('/')}
      />
      <MenuButton
        title={'Все'}
        isSelected={pathname === '/all'}
        count={entriesCount}
        onClick={() => navigate('/all')}
      />
      <MenuButton
        title={'Прочитанное'}
        isSelected={pathname === '/read'}
        count={entriesCount}
        onClick={() => navigate('/read')}
      />
      <MenuButton
        title={'Избранное'}
        isSelected={pathname === '/favorites'}
        count={entriesCount}
        onClick={() => navigate('/favorites')}
      />
    </div>
  );
}
