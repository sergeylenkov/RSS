import React from 'react';
import { Icon, Icons } from '../Icon.js';

import styles from './ReloadButton.module.css';

export class ReloadButton extends React.Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    render() {
        let counter;

        if (this.props.isSelected) {
            counter = <div className={styles.counter}>{this.props.count}</div>                  
        }

        return (
            <div className={`${styles.container} ${this.props.isActive ? styles.active : ''} ${this.props.isSelected ? styles.selected : ''}`}>
                <button className={styles.icon}  onClick={this.onUpdate}><Icon svg={Icons.reload}/></button>
                <button className={styles.label} onClick={this.onClick}>Свежее</button>                
                {counter}
            </div>
        );        
    }

    onClick() {
        if (!this.props.isSelected) {
            this.props.onClick();
        }
    }

    onUpdate() {
        this.props.onUpdate();
    }
}