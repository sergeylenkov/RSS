import React from 'react';
import { Icon, Icons } from '../Icon.js';

import styles from './MenuButton.module.css';

export class MenuButton extends React.Component {
    render() {
        const feed = this.props.feed;
        const isEdited = this.props.isEdited;

        let className = styles.container;

        if (isEdited) {
            className += ` ${styles.edited}`;

            return (
                <button className={className}>
                    <div className={styles.icon} style={{ backgroundImage: `url(${feed.icon})` }}></div>
                    <div className={styles.label}>{feed.title}</div>
                    <button className={styles.deleteButton} onClick={() => this.onDelete()}><Icon svg={Icons.trash}/></button>                    
                </button>
            );
        } else {
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
    }

    onClick() {
        this.props.onClick(this.props.feed.id);
    }

    onDelete() {
        this.props.onDelete(this.props.feed.id);
    }
}