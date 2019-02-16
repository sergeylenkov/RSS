import React from 'react';

import styles from './MenuButton.module.css';

export class MenuButton extends React.Component {
    render() {
        const feed = this.props.feed;

        let className = styles.container;

        if (feed.count === 0) {
            className += ` ${styles.empty}`;
        }

        if (this.props.isSelected) {
            className += ` ${styles.selected}`;
        }

        return (
            <button className={className} onClick={() => this.onClick()}>
                <div className={styles.icon} style={{ backgroundImage: `url(${feed.icon})` }}></div>
                <div className={styles.label}>{feed.title}</div>
                <div className={styles.counter}>{feed.count}</div>
            </button>
        );        
    }

    onClick() {
        this.props.onClick(this.props.feed.id);
    }
}