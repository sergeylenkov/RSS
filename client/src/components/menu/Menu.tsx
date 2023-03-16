import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MenuButton from './MenuButton';
import ReloadButton from './ReloadButton';
import { Bem } from '../../utils/bem';
import { State } from '../../store/reducers';

import './Menu.scss';

const block = new Bem('menu');

interface MenuProps {
  onUpdate: () => void;
}

function Menu({ onUpdate }: MenuProps): JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();
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

  const onClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={block.toString()}>
      <ReloadButton
        isActive={isUpdating}
        isSelected={pathname === '/'}
        isError={isUpdateError}
        count={unviewedCount}
        onUpdate={onUpdate}
        onClick={() => onClick('/')}
      />
      <MenuButton
        title={'Все'}
        isSelected={pathname === '/all'}
        count={entriesCount}
        onClick={() => onClick('/all')}
      />
      <MenuButton
        title={'Прочитанное'}
        isSelected={pathname === '/read'}
        count={entriesCount}
        onClick={() => onClick('/read')}
      />
      <MenuButton
        title={'Избранное'}
        isSelected={pathname === '/favorites'}
        count={entriesCount}
        onClick={() => onClick('/favorites')}
      />
    </div>
  );
}

export default Menu;
