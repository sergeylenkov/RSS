import React from 'react';
import { Icon, Icons } from '../Icon.js';

import styles from './Feed.module.css';

export class Feed extends React.Component {
    constructor(props) {
        super(props);

        this.titleFieldRef = React.createRef();

        this.onClick = this.onClick.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        return (
            <div className={styles.container}>
                {
                    this.props.isEditing ? this.renderEditMode() : this.renderViewMode()
                }
            </div>
        );
    }

    renderViewMode() {
        const feed = this.props.feed;

        return <button className={styles.button} onClick={this.onClick}>
            <div className={styles.icon} style={{ backgroundImage: `url(${feed.icon})` }}></div>
            <div className={styles.label}>{feed.title}</div>
            <div className={styles.counter}>{feed.count}</div>
        </button>
    }

    renderEditMode() {
        const feed = this.props.feed;

        return <div className={styles.editPanel}>
            <div className={styles.icon} style={{ backgroundImage: `url(${feed.icon})` }}></div>
            <input className={styles.titleField} defaultValue={feed.title} type="text" ref={this.titleFieldRef} />
            <button className={styles.editButton} onClick={this.onChange}><div className={styles.editButtonIcon}><Icon svg={Icons.checkmark}/></div></button>
            <button className={styles.editButton} onClick={this.onDelete}><div className={styles.editButtonIcon}><Icon svg={Icons.trash}/></div></button>
        </div>
    }

    onClick() {
        this.props.onClick(this.props.feed.id);
    }

    onDelete() {
        this.props.onDelete(this.props.feed.id);
    }

    onChange() {
        const value = this.titleFieldRef.current.value;

        this.props.onChange(this.props.feed.id, value);
    }
}