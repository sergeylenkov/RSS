import React from 'react';
import { Menu } from './components/menu/Menu.js';
import { EntriesList } from './components/entries/List.js';
import { DataHelper } from './data/DataHelper.js';
import { FeedsList } from './components/feeds/Feeds.js';
import { connect } from 'react-redux';
import { entriesUpdating, entriesUpdated, feedsUpdated, updateUnviewedCount, updateViewed } from './store/actions/index';

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
                this.props.updateUnviewedCount();
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
                    <div className={styles.feeds}><FeedsList onAddFeed={(link) => this.onAddFeed(link)} /></div>
                </div>
            </div>
        );
    }

    onUpdate() {
        this.props.entriesUpdating();

        this.dataHelper.update().then(entries => {
            const unviewed = entries.filter((entry) => {
                return !entry.isViewed;
            });
            
            this.setState({
                type: 0
            });

            this.props.entriesUpdated(unviewed);
            this.props.updateUnviewedCount();
        });
    }

    onShowAll() {
        this.dataHelper.getAllNews(0, this.entriesPerPage).then((entries) => {
            this.setState({
                type: 1
            });

            this.props.entriesUpdated(entries);            
        });
    }

    onShowRead() {
        this.dataHelper.getReadNews(0, this.entriesPerPage).then((entries) => {
            this.setState({
                type: 2
            });

            this.props.entriesUpdated(entries);            
        });
    }

    onShowBookmark() {
        this.dataHelper.getBookmarkNews(0, this.entriesPerPage).then((entries) => {
            this.setState({
                type: 3
            });

            this.props.entriesUpdated(entries);            
        });
    }

    onUpdateViewed(ids) {
        if (this.state.type === 0) {
            this.props.updateViewed(ids);
            this.props.updateUnviewedCount();
            
            this.dataHelper.markAsViewed(ids).then((data) => {
                console.log(data);
            });
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
        /*this.setState({
            isUpdating: true
        });*/

        this.dataHelper.addFeed(feed).then((response) => {
            //const feed = response.channel;
            console.log(response);
            //const feeds = [...this.state.feeds];
            //feeds.push(feed);            
            //this.updateFeedsCount(false);
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
        entriesUpdating: () => dispatch(entriesUpdating()),
        entriesUpdated: (entries) => dispatch(entriesUpdated(entries)),
        updateUnviewedCount: () => dispatch(updateUnviewedCount()),
        updateViewed: (ids) => dispatch(updateViewed(ids))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(App)