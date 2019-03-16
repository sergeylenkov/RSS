import React from 'react';
import { Icon, Icons } from '../Icon.js';

import styles from './Button.module.css';

export class SettingsButton extends React.Component {
    render() {
        return (
            <button className={styles.container} onClick={() => this.props.onClick()}>
                <div className={styles.icon}><Icon svg={Icons.settings}/></div>                
            </button>
        );        
    }
}