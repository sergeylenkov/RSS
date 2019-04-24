import React from 'react';

import styles from './Feed.module.css';

export class Feed extends React.Component {
    render() {
        const feed = this.props.feed;

        return (
            <button className={styles.container} onClick={() => this.onClick()}>
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