import React from 'react';
import { Icon, Icons } from '../Icon.js';

import styles from './ReloadButton.module.css';

export class ReloadButton extends React.Component {
    render() {
        return (
            <button className={`${styles.container} ${this.props.isActive ? styles.active : ''} ${this.props.isSelected ? styles.selected : ''}`} onClick={() => this.props.onClick()}>
                <div className={styles.icon}><Icon svg={Icons.reload}/></div>
                <div className={styles.label}>Свежее</div>
                <div className={styles.counter}>{this.props.count}</div>
            </button>
        );        
    }
}