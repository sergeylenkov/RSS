import React from 'react';
import { ReloadIcon } from '../Icons.js';
import { MenuButton } from './MenuButton.js';

import styles from './ReloadButton.module.css';

export class ReloadButton extends React.Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
    }

    render() {
        return (
            <div className={`${styles.container} ${this.props.isActive ? styles.active : ''}`}>
                <button className={styles.icon} onClick={this.onUpdate}><ReloadIcon /></button>
                <MenuButton title={'Свежее'} isSelected={this.props.isSelected} count={this.props.count} onClick={this.onClick} />
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