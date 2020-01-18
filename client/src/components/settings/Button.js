import React from 'react';
import { SettingsIcon } from '../Icons.js';

import styles from './Button.module.css';

export class SettingsButton extends React.Component {
    render() {
        return (
            <button className={`${styles.container} ${this.props.isActive ? styles.active : ''}`} onClick={this.props.onClick}>
                <div className={styles.icon}><SettingsIcon /></div>
            </button>
        );
    }
}