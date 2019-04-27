import React from 'react';
import { ReloadButton } from './ReloadButton.js';
import { MenuButton } from './MenuButton.js';

import styles from './Menu.module.css';

export class Menu extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <ReloadButton isActive={this.props.isUpdating} isSelected={this.props.type === 0} count={this.props.count} onClick={() => this.props.onReload()}/>
                <MenuButton title={'Все'} isSelected={this.props.type === 1} onClick={this.props.onShowAll} />
                <MenuButton title={'Прочитанное'} isSelected={this.props.type === 2} onClick={this.props.onShowRead} />
                <MenuButton title={'Избранное'} isSelected={this.props.type === 3} onClick={this.props.onShowBookmark}/>
            </div>
        );
    }
}