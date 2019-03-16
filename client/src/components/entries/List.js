import React from 'react';
import { Entry } from './Entry.js';
import { debounce } from '../../Utils.js';

import styles from './List.module.css';

export class EntriesList extends React.Component {
    constructor(props) {
        super(props);

        this._viewedIds = [];

        this._updateViewed = debounce(() => {            
            console.log('update viewd', this._viewedIds);
            this.props.onUpdateViewed(this._viewedIds);
            this._viewedIds = [];
        }, 1000, false);
    }

    render() {
        const isCollapseLong = JSON.parse(localStorage.getItem('collpaseLong'));

        return (
            <div className={styles.container}>
                {
                    this.props.entries.map((entry) => {
                        const isRead = parseInt(entry.read);
                        return <Entry key={entry.id} entry={entry} isRead={isRead} isCollapseLong={isCollapseLong} onView={(id) => this.onView(id)} onRead={(id) => this.onRead(id)} />
                    })
                }
            </div>
        );
    }

    onView(id) {
        this._viewedIds.push(id);
        this._updateViewed();
    }

    onRead(id) {
        this.props.onUpdateReaded(id);
    }
}