import React from 'react';
import { Menu } from './components/menu/Menu.js';
import { EntriesList } from './components/entries/List.js';
import { DataHelper } from './data/DataHelper.js';
import { FeedsList } from './components/feeds/Feeds.js';
import { connect } from 'react-redux';
import { entriesUpdated, feedsUpdated, updateEntriesCount } from './store/actions/index';

import styles from './App.module.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.entriesPerPage = 30;

        this.state = {            
            selectedFeeds: {},
            type: 0
        }

        this.dataHelper = new DataHelper('http://localhost:5000/', false);

        if (localStorage.getItem('collpaseLong') === null) {
            localStorage.setItem('collpaseLong', false);
        }

        if (localStorage.getItem('keepDays') === null) {
            localStorage.setItem('keepDays', 30);
        }

        this.onUpdate = this.onUpdate.bind(this);
        this.onShowAll = this.onShowAll.bind(this);
        this.onShowRead = this.onShowRead.bind(this);
        this.onShowBookmark = this.onShowBookmark.bind(this);
    }

    componentDidMount() {
        this.dataHelper.getFeeds().then(feeds => {
            console.log(feeds);
            this.props.feedsUpdated(feeds);
            this.dataHelper.getUnviewed().then((entries) => {
                console.log(entries);
                let selectedFeeds = {};

                feeds.forEach(feed => {
                    selectedFeeds[feed.id] = false;
                });

                this.setState({
                    selectedFeeds: selectedFeeds,
                    type: 0
                });

                this.props.entriesUpdated(entries);
                this.updateFeedsCount(true);
            });            
        });
    }

    render() {
        let count = 0;

        if (this.state.type === 0) {
            count = this.props.feeds.reduce((accumulator, currentValue) => {         
                return accumulator + currentValue.count;
            }, 0);
        }

        return (
            <div className={styles.container}>
                <div className={styles.menu}><Menu type={this.state.type} count={count} onUpdate={this.onUpdate} onShowAll={this.onShowAll} onShowRead={this.onShowRead} onShowBookmark={this.onShowBookmark} /></div>
                <div className={styles.content}>
                    <div className={styles.list}><EntriesList onUpdateViewed={(ids) => this.onUpdateViewed(ids)} onUpdateReaded={(id) => this.onUpdateReaded(id)} onSetFavorite={(id) => this.onSetFavorite(id)} /></div>
                    <div className={styles.feeds}><FeedsList /></div>
                </div>
            </div>
        );
    }

    onUpdate() {
        this.dataHelper.update().then(entries => {            
            this.entries = entries.filter((element) => {
                return element.isViewed === false;
            });
            console.log(this.entries);
            this.setState({
                type: 0
            });
            this.props.entriesUpdated(entries);
            this.updateFeedsCount(true);
        });
    }

    onShowAll() {
        this.dataHelper.getAllNews(0, this.entriesPerPage).then((entries) => {
            this.setState({
                type: 1
            });

            this.props.entriesUpdated(entries);
            this.updateFeedsCount(false);
        });
    }

    onShowRead() {
        this.dataHelper.getReadNews(0, this.entriesPerPage).then((entries) => {
            this.setState({
                type: 2
            });

            this.props.entriesUpdated(entries);
            this.updateFeedsCount(false);
        });
    }

    onShowBookmark() {
        this.dataHelper.getBookmarkNews(0, this.entriesPerPage).then((entries) => {
            this.setState({
                type: 3
            });

            this.props.entriesUpdated(entries);
            this.updateFeedsCount(false);
        });
    }

    updateFeedsCount(unviewed) {
        this.props.updateEntriesCount()
        /*const feeds = [...this.state.feeds];

        feeds.forEach(feed => {
            const count = this.props.entries.filter(entry => {
                if (unviewed) {
                    return entry.feedId === feed.id && entry.isViewed !== true
                }

                return entry.feedId === feed.id;
            }).length;

            feed.count = count;
        });

        this.setState({
            feeds: feeds
        });*/
    }

    onUpdateViewed(ids) {
        if (this.state.type === 0) {    
            this.updateFeedsCount(true);
            /*this.dataHelper.markAsViewed(ids).then((data) => {
                console.log(data);
            });*/
        }
    }

    onUpdateReaded(id) {
        this.dataHelper.markAsRead([id]);
    }

    onSetFavorite(id) {
        this.dataHelper.setFavorite(id);
    }

    onFeedSelect(id) {
        let feeds = this.state.selectedFeeds;
        feeds[id] = !feeds[id];

        let filtered = false;

        Object.keys(feeds).forEach(key => {
            if (feeds[key]) {
                filtered = true;
            }
        });
        
        if (filtered) {
            const entries = this.entries.filter(entry => {
                return feeds[entry.feedId];
            });
         
            this.setState({
                entries: entries,
                selectedFeeds: feeds
            });
        } else {
            this.setState({
                entries: this.entries,
                selectedFeeds: feeds
            });
        }
    }

    onFeedDelete(id) {
        console.log('onFeedDelete', id);
        this.dataHelper.deleteFeed(id).then(() => {
            const feeds = [...this.state.feeds];

            let index = -1;

            feeds.forEach((feed, i) => {
                if (feed.id === id) {
                    index = i;
                }
            });

            if (index >= 0) {
                delete feeds[index];

                this.setState({
                    feeds: feeds,
                });
            }
        });
    }

    onAddFeed(feed) {
        this.setState({
            isUpdating: true
        });

        this.dataHelper.addNewFeed(feed).then((response) => {
            const feed = response.channel;
            console.log(response);
            const feeds = [...this.state.feeds];
            feeds.push(feed);
            
            this.updateFeedsCount(false);
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

const mapStateToProps = state => {
    return {
        entries: state.entries,
        feeds: state.feeds
    };
};

const mapDispatchToProps = dispatch => {
    return {
        feedsUpdated: (feeds) => dispatch(feedsUpdated(feeds)),
        entriesUpdated: (entries) => dispatch(entriesUpdated(entries)),
        updateEntriesCount: () => dispatch(updateEntriesCount())
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(App)