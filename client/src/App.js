import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Menu } from './components/menu/Menu.js';
import { EntriesList } from './components/entries/List.js';
import { DataHelper } from './data/DataHelper.js';
import { FeedsList } from './components/feeds/Feeds.js';
import { SettingsButton } from './components/settings/Button.js';
import { Settings } from './components/settings/Settings.js';
import { connect } from 'react-redux';
import {
    entriesUpdating, entriesUpdated, feedsUpdated, feedsAdd, feedsDelete,
    updateUnviewedCount, updateViewed, updateFavorite, updateRead,
    changeViewMode, updateEntriesCount, feedsUpdate, feedsEditing
} from './store/actions/index.js';

import lightStyles from './App.module.css';
import darkStyles from './App.dark.module.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.dataHelper = new DataHelper('http://localhost:5000/', false);

        this.state = {
            isSettingsVisible: false
        };

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
        this.onUpdateViewed = this.onUpdateViewed.bind(this);
        this.onUpdateReaded = this.onUpdateReaded.bind(this);
        this.onSetFavorite = this.onSetFavorite.bind(this);
        this.onAddFeed = this.onAddFeed.bind(this);
        this.onChangeFeed = this.onChangeFeed.bind(this);
        this.onDeleteFeed = this.onDeleteFeed.bind(this);
        this.onToggleSettings = this.onToggleSettings.bind(this);
        this.hideSettings = this.hideSettings.bind(this);
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

        this.dataHelper.clearEntries(localStorage.getItem('keepDays'));
    }

    render() {
        let styles = {};

        if (this.props.isDarkTheme) {
            styles = {...lightStyles, ...darkStyles};
        } else {
            styles = lightStyles;
        }
        console.log(styles);
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <Menu onUpdate={this.onUpdate} onShowUnviewed={this.onShowUnviewed} onShowAll={this.onShowAll} onShowRead={this.onShowRead} onShowFavorites={this.onShowFavorites} />
                        <SettingsButton isActive={this.state.isSettingsVisible} onClick={this.onToggleSettings}/>

                        <CSSTransition
                            in={this.state.isSettingsVisible}
                            timeout={200}
                            classNames="fade"
                            unmountOnExit
                            appear
                        >
                        <Settings isVisible={this.state.isSettingsVisible} />
                        </CSSTransition>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.list}>
                        <EntriesList onUpdateViewed={this.onUpdateViewed} onUpdateReaded={this.onUpdateReaded} onSetFavorite={this.onSetFavorite} />
                    </div>
                    <div className={styles.feeds}>
                        <FeedsList onAddFeed={this.onAddFeed} onChangeFeed={this.onChangeFeed} onDeleteFeed={this.onDeleteFeed} />
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
            this.props.updateEntriesCount();
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

    onAddFeed(link) {
        this.dataHelper.addFeed(link).then((feed) => {
            console.log(feed);
            this.props.feedsAdd(feed);
        });
    }

    onChangeFeed(id, data) {
        this.dataHelper.updateFeed(id, data).then((data) => {
            console.log(data);
            this.props.feedsUpdate(id, data.data);
            this.props.feedsEditing(false);
        });
    }

    onDeleteFeed(id) {
        this.dataHelper.deleteFeed(id).then((data) => {
            console.log(data);
            this.props.feedsDelete(id);
            this.props.feedsEditing(false);
        });
    }

    onToggleSettings() {
        const visible = !this.state.isSettingsVisible;

        if (visible) {
            document.addEventListener('click', this.hideSettings);
        } else {
            document.removeEventListener('click', this.hideSettings);
        }

        this.setState({
            isSettingsVisible: visible
        });
    }

    hideSettings() {
        if (this.state.isSettingsVisible) {
            this.onToggleSettings();
        }
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        isDarkTheme: state.isDarkTheme
    };
};

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
        changeViewMode: (mode) => dispatch(changeViewMode(mode)),
        feedsUpdate: (id, data) => dispatch(feedsUpdate(id, data)),
        feedsEditing: (isEditing) => dispatch(feedsEditing(isEditing))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App)