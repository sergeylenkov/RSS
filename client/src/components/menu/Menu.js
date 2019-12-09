import React from 'react';
import { ReloadButton } from './ReloadButton.js';
import { MenuButton } from './MenuButton.js';
import { connect } from 'react-redux';

import styles from './Menu.module.css';

class ConnectedMenu extends React.Component {
    constructor(props) {
        super(props);

        this.onUpdate = this.onUpdate.bind(this);
    }

    render() {
        return (
            <div className={styles.container}>
                <ReloadButton isActive={this.props.isUpdating} isSelected={this.props.type === 0} count={this.props.count} onClick={this.onUpdate}/>
                <MenuButton title={'Все'} isSelected={this.props.type === 1} onClick={this.props.onShowAll} />
                <MenuButton title={'Прочитанное'} isSelected={this.props.type === 2} onClick={this.props.onShowRead} />
                <MenuButton title={'Избранное'} isSelected={this.props.type === 3} onClick={this.props.onShowBookmark}/>
            </div>
        );
    }

    onUpdate() {        
        this.props.updateFeeds();
        this.props.onUpdate();
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        isUpdating: state.isUpdating
    };
};

export const Menu = connect(mapStateToProps)(ConnectedMenu);