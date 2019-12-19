import React from 'react';
import { ReloadButton } from './ReloadButton.js';
import { MenuButton } from './MenuButton.js';
import { connect } from 'react-redux';

import styles from './Menu.module.css';

class ConnectedMenu extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <ReloadButton isActive={this.props.isUpdating} isSelected={this.props.viewMode === 0} count={this.props.unviewedCount} onUpdate={this.props.onUpdate} onClick={this.props.onShowUnviewed}/>
                <MenuButton title={'Все'} isSelected={this.props.viewMode === 1} count={this.props.entriesCount} onClick={this.props.onShowAll} />
                <MenuButton title={'Прочитанное'} isSelected={this.props.viewMode === 2} count={this.props.entriesCount} onClick={this.props.onShowRead} />
                <MenuButton title={'Избранное'} isSelected={this.props.viewMode === 3} count={this.props.entriesCount} onClick={this.props.onShowFavorites}/>
            </div>
        );
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        isUpdating: state.isUpdating,
        unviewedCount: state.unviewedCount,
        entriesCount: state.entriesCount,
        viewMode: state.viewMode
    };
};

export const Menu = connect(mapStateToProps)(ConnectedMenu);