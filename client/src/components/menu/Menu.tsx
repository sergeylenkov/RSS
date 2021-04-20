import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import MenuButton from './MenuButton';
import ReloadButton from './ReloadButton';
import { connect } from 'react-redux';
import { Bem } from '../../utils/bem';

import './Menu.scss';

const block = new Bem('menu');

interface MapStateToProps extends RouteComponentProps {
  isUpdating: boolean;
  isUpdateError: boolean;
  unviewedCount: number;
  entriesCount: number;
}

interface MenuProps extends MapStateToProps {
  onUpdate: () => void;
}

class Menu extends React.Component<MenuProps> {
  private onClick = (path: string) => {
    const { history } = this.props;

    history.push(path);
  }

  public render() {
    const {
      isUpdating,
      isUpdateError,
      unviewedCount,
      entriesCount,
      onUpdate,
      location: { pathname }
    } = this.props;

    return (
      <div className={block.build()}>
        <ReloadButton
          isActive={isUpdating}
          isSelected={pathname === '/'}
          isError={isUpdateError}
          count={unviewedCount}
          onUpdate={onUpdate}
          onClick={() => this.onClick('/')}
        />
        <MenuButton title={'Все'} isSelected={pathname === '/all'} count={entriesCount} onClick={() => this.onClick('/all')} />
        <MenuButton title={'Прочитанное'} isSelected={pathname === '/read'} count={entriesCount} onClick={() => this.onClick('/read')} />
        <MenuButton title={'Избранное'} isSelected={pathname === '/favorites'} count={entriesCount} onClick={() => this.onClick('/favorites')} />
      </div>
    );
  }
}

/* Redux */

const mapStateToProps = (state: MapStateToProps) => {
  return {
    isUpdating: state.isUpdating,
    isUpdateError: state.isUpdateError,
    unviewedCount: state.unviewedCount,
    entriesCount: state.entriesCount,
  };
};

export default connect(mapStateToProps)(withRouter(Menu));
