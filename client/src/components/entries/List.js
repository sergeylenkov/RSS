import React from 'react';
import { Entry } from './Entry.js';
import { debounce } from '../../Utils.js';
import { connect } from 'react-redux';

import styles from './List.module.css';

class ConnectedEntriesList extends React.Component {
    constructor(props) {
        super(props);

        this._viewedIds = [];

        this._updateViewed = debounce(() => {
            this.props.onUpdateViewed(this._viewedIds);
            this._viewedIds = [];
        }, 1000, false);

        this.onSetFavorite = this.onSetFavorite.bind(this);
        this.onSetRead = this.onSetRead.bind(this);
        this.onView = this.onView.bind(this);
    }

    render() {
        const isCollapseLong = JSON.parse(localStorage.getItem('collpaseLong'));

        return (
            <div className={styles.container}>
                {
                    this.props.entries.map((entry) => {
                        return (
                            <Entry
                                key={entry.id}
                                entry={entry}
                                isCollapseLong={isCollapseLong}
                                viewMode={this.props.viewMode}
                                onView={this.onView}
                                onSetRead={this.onSetRead}
                                onSetFavorite={this.onSetFavorite} />
                        )
                    })
                }
            </div>
        );
    }

    onView(id) {
        this._viewedIds.push(id);
        this._updateViewed();
    }

    onSetRead(id, isRead) {
        this.props.onSetRead(id, isRead);
    }

    onSetFavorite(id, isFavorite) {
        this.props.onSetFavorite(id, isFavorite);
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        entries: state.entries,
        viewMode: state.viewMode
    };
};

export const EntriesList = connect(mapStateToProps)(ConnectedEntriesList);