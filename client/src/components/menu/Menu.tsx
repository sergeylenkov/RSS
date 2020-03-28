import MenuButton from './MenuButton';
import React from 'react';
import ReloadButton from './ReloadButton';
import { connect } from 'react-redux';
import styles from './Menu.module.css';

interface MapStateToProps {
  isUpdating: boolean,
  isUpdateError: boolean,
  unviewedCount: number,
  entriesCount: number,
  viewMode: number
}

interface MenuProps extends MapStateToProps {
  onUpdate: () => void;
  onShowUnviewed: () => void;
  onShowAll: () => void;
  onShowRead: () => void;
  onShowFavorites: () => void;
}

class Menu extends React.Component<MenuProps> {
  public render() {
    const {
      isUpdating,
      viewMode,
      isUpdateError,
      unviewedCount,
      entriesCount,
      onUpdate,
      onShowUnviewed,
      onShowAll,
      onShowRead,
      onShowFavorites
    } = this.props;

    return (
      <div className={styles.container}>
        <ReloadButton
          isActive={isUpdating}
          isSelected={viewMode === 0}
          isError={isUpdateError}
          count={unviewedCount}
          onUpdate={onUpdate}
          onClick={onShowUnviewed}
        />
        <MenuButton title={'Все'} isSelected={viewMode === 1} count={entriesCount} onClick={onShowAll} />
        <MenuButton title={'Прочитанное'} isSelected={viewMode === 2} count={entriesCount} onClick={onShowRead} />
        <MenuButton title={'Избранное'} isSelected={viewMode === 3} count={entriesCount} onClick={onShowFavorites} />
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
    viewMode: state.viewMode
  };
};

export default connect(mapStateToProps)(Menu);
