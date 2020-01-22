import React from 'react';
import { connect } from 'react-redux';
import { CheckmarkIcon, TrashIcon } from '../Icons.js';

import lightStyles from './Feed.module.css';
import darkStyles from './Feed.dark.module.css';

export class ConnectedFeed extends React.Component {
    constructor(props) {
        super(props);

        this.titleFieldRef = React.createRef();

        this.onSelect = this.onSelect.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        let styles = {};

        if (this.props.isDarkTheme) {
            styles = {...lightStyles, ...darkStyles};
        } else {
            styles = lightStyles;
        }

        return (
            <div className={styles.container}>
                {
                    this.props.isEditing ? this.renderEditMode() : this.renderViewMode()
                }
            </div>
        );
    }

    renderViewMode() {
        let styles = {};

        if (this.props.isDarkTheme) {
            styles = {...lightStyles, ...darkStyles};
        } else {
            styles = lightStyles;
        }

        const feed = this.props.feed;

        return <button className={`${styles.button} ${this.props.isSelected ? styles.selected : ''}`} onClick={this.onSelect}>
            <div className={styles.icon} style={{ backgroundImage: `url(${feed.icon})` }}></div>
            <div className={styles.label}>{feed.title}</div>
            <div className={styles.counter}>{feed.count}</div>
        </button>
    }

    renderEditMode() {
        let styles = {};

        if (this.props.isDarkTheme) {
            styles = {...lightStyles, ...darkStyles};
        } else {
            styles = lightStyles;
        }

        const feed = this.props.feed;

        return <div className={styles.editPanel}>
            <div className={styles.icon} style={{ backgroundImage: `url(${feed.icon})` }}></div>
            <input className={styles.titleField} defaultValue={feed.title} type="text" ref={this.titleFieldRef} />
            <button className={styles.editButton} onClick={this.onChange}><div className={styles.editButtonIcon}><CheckmarkIcon /></div></button>
            <button className={styles.editButton} onClick={this.onDelete}><div className={styles.editButtonIcon}><TrashIcon /></div></button>
        </div>
    }

    onSelect() {
        this.props.onSelect(this.props.feed.id);
    }

    onDelete() {
        this.props.onDelete(this.props.feed.id);
    }

    onChange() {
        const value = this.titleFieldRef.current.value;

        this.props.onChange(this.props.feed.id, value);
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        isDarkTheme: state.isDarkTheme
    };
};

export const Feed = connect(mapStateToProps)(ConnectedFeed);