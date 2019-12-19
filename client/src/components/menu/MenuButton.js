import React from 'react';

import styles from './MenuButton.module.css';

export class MenuButton extends React.Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    render() {
        let counter;

        if (this.props.isSelected) {
            counter = <div className={styles.counter}>{this.props.count}</div>                  
        }

        return (
            <button className={`${styles.container} ${this.props.isSelected ? styles.selected : ''}`} onClick={this.onClick}>
                <div className={styles.label}>{this.props.title}</div>
                {counter}
            </button>
        )
    }

    onClick() {
        if (!this.props.isSelected) {
            this.props.onClick();
        }
    }
}