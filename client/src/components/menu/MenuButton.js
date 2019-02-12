import React from 'react';

import styles from './MenuButton.module.css';

export class MenuButton extends React.Component {
    render() {
        return (
            <button className={styles.container} onClick={() => this.props.onClick()}>                
                <div className={styles.icon} style={{ backgroundImage: `url(${this.props.icon})` }}></div>
                <div className={styles.label}>{this.props.title}</div>
                <div className={styles.counter}>{this.props.count}</div>
            </button>
        );        
    }
}