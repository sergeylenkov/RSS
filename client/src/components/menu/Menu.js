import React from 'react';
import { ReloadButton } from './ReloadButton.js';
import { MenuButton } from './MenuButton.js';
import { MenuEdit } from './edit/Edit.js';

import styles from './Menu.module.css';

export class Menu extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <ReloadButton isActive={this.props.isUpdating} onClick={() => this.props.onReload()}/>

                <div className={styles.feeds}>
                    {this.props.feeds.map((feed, i) => {
                        return (<MenuButton key={feed.id} icon={feed.icon} title={feed.title} count={feed.count} />)
                    })}
                </div>

                <MenuEdit isDisabled={this.props.isUpdating} onEdit={() => this.onEdit()}/>
            </div>
        );
    }

    onEdit() {

    }
}