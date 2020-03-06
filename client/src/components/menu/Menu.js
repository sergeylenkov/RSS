import { MenuButton } from './MenuButton.js';
import React from 'react';
import { ReloadButton } from './ReloadButton.js';
import { connect } from 'react-redux';
import styles from './Menu.module.css';

class ConnectedMenu extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <ReloadButton
          isActive={this.props.isUpdating}
          isSelected={this.props.viewMode === 0}
          isError={this.props.isUpdateError}
          count={this.props.unviewedCount}
          onUpdate={this.props.onUpdate}
          onClick={this.props.onShowUnviewed}
        />
        <MenuButton title={'Все'} isSelected={this.props.viewMode === 1} count={this.props.entriesCount} onClick={this.props.onShowAll} />
        <MenuButton title={'Прочитанное'} isSelected={this.props.viewMode === 2} count={this.props.entriesCount} onClick={this.props.onShowRead} />
        <MenuButton title={'Избранное'} isSelected={this.props.viewMode === 3} count={this.props.entriesCount} onClick={this.props.onShowFavorites} />
      </div>
    );
  }
}

/* Redux */

const mapStateToProps = state => {
  return {
    isUpdating: state.isUpdating,
    isUpdateError: state.isUpdateError,
    unviewedCount: state.unviewedCount,
    entriesCount: state.entriesCount,
    viewMode: state.viewMode
  };
};

export const Menu = connect(mapStateToProps)(ConnectedMenu);