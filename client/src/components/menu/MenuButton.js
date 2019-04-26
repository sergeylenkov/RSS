import React from 'react';

import styles from './MenuButton.module.css';

export class MenuButton extends React.Component {
    render() {
        return (
            <button className={`${styles.container} ${this.props.isSelected ? styles.selected : ''}`} onClick={() => this.onClick()}>                    
                <div className={styles.label}>{this.props.title}</div>                    
            </button>
        )
    }

    onClick() {
        this.props.onClick();
    }
}