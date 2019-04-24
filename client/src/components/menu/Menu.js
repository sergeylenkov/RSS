import React from 'react';
import { ReloadButton } from './ReloadButton.js';

import styles from './Menu.module.css';

export class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isScrolled: false
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <ReloadButton isActive={this.props.isUpdating} count={this.props.count} onClick={() => this.props.onReload()}/>
            </div>
        );
    }
}