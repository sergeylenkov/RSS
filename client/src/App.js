import React from 'react';
import { Menu } from './components/menu/Menu.js';
import { EntriesList } from './components/entries/List.js';
import { DataHelper } from './data/DataHelper.js';
import { FeedsList } from './components/feeds/Feeds.js';
import { connect } from 'react-redux';
import {
    entriesUpdating, entriesUpdated, feedsUpdated, feedsAdd, feedsDelete,
    updateUnviewedCount, updateViewed, updateFavorite, updateRead,
    changeViewMode, updateEntriesCount
} from './store/actions/index';

import styles from './App.module.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.dataHelper = new DataHelper('http://localhost:5000/', false);

        if (localStorage.getItem('collpaseLong') === null) {
            localStorage.setItem('collpaseLong', false);
        }

        if (localStorage.getItem('keepDays') === null) {
            localStorage.setItem('keepDays', 30);
        }

        this.onUpdate = this.onUpdate.bind(this);
        this.onShowUnviewed = this.onShowUnviewed.bind(this);
        this.onShowAll = this.onShowAll.bind(this);
        this.onShowRead = this.onShowRead.bind(this);
        this.onShowFavorites = this.onShowFavorites.bind(this);
    }

    componentDidMount() {
        this.dataHelper.getFeeds().then(feeds => {
            console.log(feeds);
            this.props.feedsUpdated(feeds);
            this.dataHelper.getUnviewed().then((entries) => {
                console.log(entries);
                this.props.entriesUpdated(entries);
                this.props.updateUnviewedCount();
            });
        });
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.menu}>
                    <Menu onUpdate={this.onUpdate} onShowUnviewed={this.onShowUnviewed} onShowAll={this.onShowAll} onShowRead={this.onShowRead} onShowFavorites={this.onShowFavorites} />
                </div>
                <div className={styles.content}>
                    <div className={styles.list}>
                        <EntriesList onUpdateViewed={(ids) => this.onUpdateViewed(ids)} onUpdateReaded={(id) => this.onUpdateReaded(id)} onSetFavorite={(id, isFavorite) => this.onSetFavorite(id, isFavorite)} />
                    </div>
                    <div className={styles.feeds}>
                        <FeedsList onAddFeed={(link) => this.onAddFeed(link)} />
                    </div>
                </div>
            </div>
        );
    }

    onUpdate() {
        this.props.entriesUpdating();
        this.props.changeViewMode(0);

        this.dataHelper.update().then(entries => {
            const unviewed = entries.filter((entry) => {
                return !entry.isViewed;
            });

            this.props.entriesUpdated(unviewed);
            this.props.updateUnviewedCount();
        });
    }

    onShowUnviewed() {
        this.props.changeViewMode(0);

        this.dataHelper.getUnviewed().then(entries => {
            this.props.entriesUpdated(entries);
            this.props.updateUnviewedCount();
        });
    }

    onShowAll() {
        this.props.changeViewMode(1);

        this.dataHelper.allEntries().then((entries) => {
            this.props.entriesUpdated(entries);
        });
    }

    onShowRead() {
        this.props.changeViewMode(2);

        this.dataHelper.readEntries().then((entries) => {
            this.props.entriesUpdated(entries);
            this.props.updateEntriesCount();
        });
    }

    onShowFavorites() {
        this.props.changeViewMode(3);

        this.dataHelper.getFavorites().then((entries) => {
            this.props.entriesUpdated(entries);
            this.props.updateEntriesCount();
        });
    }

    onUpdateViewed(ids) {
        this.dataHelper.setViewed(ids).then((data) => {
            this.props.updateViewed(ids);
            this.props.updateUnviewedCount();
        });
    }

    onUpdateReaded(id) {
        this.dataHelper.setRead(id).then((data) => {
            this.props.updateRead(id);
        });
    }

    onSetFavorite(id, isFavorite) {
        this.dataHelper.setFavorite(id, isFavorite).then((data) => {
            this.props.updateFavorite(id, isFavorite);
        });
    }

    onFeedSelect(id) {
    }

    onFeedDelete(id) {
        this.dataHelper.deleteFeed(id).then(() => {
            this.props.feedsDelete(id);
        });
    }

    onAddFeed(link) {
        this.dataHelper.addFeed(link).then((feed) => {
            console.log(feed);
            this.props.feedsAdd(feed);
        });
    }

    onToggleSettings() {
        const visible = !this.state.isSettingsVisible;

        this.setState({
            isSettingsVisible: visible
        });
    }
}

/* Redux */

const mapDispatchToProps = dispatch => {
    return {
        feedsUpdated: (feeds) => dispatch(feedsUpdated(feeds)),
        entriesUpdating: () => dispatch(entriesUpdating()),
        entriesUpdated: (entries) => dispatch(entriesUpdated(entries)),
        updateUnviewedCount: () => dispatch(updateUnviewedCount()),
        updateEntriesCount: () => dispatch(updateEntriesCount()),
        updateViewed: (ids) => dispatch(updateViewed(ids)),
        updateFavorite: (id, isFavorite) => dispatch(updateFavorite(id, isFavorite)),
        feedsAdd: (feed) => dispatch(feedsAdd(feed)),
        feedsDelete: (id) => dispatch(feedsDelete(id)),
        updateRead: (id) => dispatch(updateRead(id)),
        changeViewMode: (mode) => dispatch(changeViewMode(mode))
    };
};


export default connect(null, mapDispatchToProps)(App)