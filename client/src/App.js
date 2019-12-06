import React from 'react';
import { Menu } from './components/menu/Menu.js';
import { EntriesList } from './components/entries/List.js';
import { DataHelper } from './data/DataHelper.js';
import { FeedsList } from './components/feeds/Feeds.js';

import styles from './App.module.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.entries = [];
        this.entriesPerPage = 30;

        this.state = {
            feeds: [],
            entries: [],
            selectedFeeds: {},
            isUpdating: false,
            type: 0
        }

        this.dataHelper = new DataHelper('http://localhost:5000/', false);

        if (localStorage.getItem('collpaseLong') === null) {
            localStorage.setItem('collpaseLong', false);
        }

        if (localStorage.getItem('keepDays') === null) {
            localStorage.setItem('keepDays', 30);
        }

        this.onReload = this.onReload.bind(this);
        this.onShowAll = this.onShowAll.bind(this);
        this.onShowRead = this.onShowRead.bind(this);
        this.onShowBookmark = this.onShowBookmark.bind(this);
    }

    componentDidMount() {
        this.dataHelper.getFeeds().then(feeds => {
            console.log(feeds);
            this.dataHelper.getUnviewed().then((entries) => {
                console.log(entries);
                this.entries = entries;

                let selectedFeeds = {};

                feeds.forEach(feed => {
                    selectedFeeds[feed.id] = false;
                });

                this.setState({
                    feeds: feeds,
                    entries: entries,
                    selectedFeeds: selectedFeeds,
                    type: 0
                });

                this.updateFeedsCount(true);
            });            
        });
    }

    render() {
        let count = 0;

        if (this.state.type === 0) {
            count = this.state.feeds.reduce((accumulator, currentValue) => {         
                return accumulator + currentValue.count;
            }, 0);
        }

        return (
            <div className={styles.container}>
                <div className={styles.menu}><Menu isUpdating={this.state.isUpdating} type={this.state.type} count={count} onReload={this.onReload} onShowAll={this.onShowAll} onShowRead={this.onShowRead} onShowBookmark={this.onShowBookmark} /></div>
                <div className={styles.content}>
                    <div className={styles.list}><EntriesList entries={this.state.entries} onUpdateViewed={(ids) => this.onUpdateViewed(ids)} onUpdateReaded={(id) => this.onUpdateReaded(id)} onSetFavorite={(id) => this.onSetFavorite(id)} /></div>
                    <div className={styles.feeds}><FeedsList feeds={this.state.feeds} /></div>
                </div>
            </div>
        );
    }

    onReload() {
        this.setState({
            isUpdating: true
        });

        this.dataHelper.update().then(entries => {            
            this.entries = entries.filter((element) => {
                return element.isViewed === false;
            });
            console.log(this.entries);
            this.setState({
                entries: this.entries,
                isUpdating: false,
                type: 0
            });

            this.updateFeedsCount(true);
        });
    }

    onShowAll() {
        this.dataHelper.getAllNews(0, this.entriesPerPage).then((entries) => {
            this.entries = entries;

            this.setState({
                entries: entries,
                type: 1
            });

            this.updateFeedsCount(false);
        });
    }

    onShowRead() {
        this.dataHelper.getReadNews(0, this.entriesPerPage).then((entries) => {
            this.entries = entries;

            this.setState({
                entries: entries,
                type: 2
            });

            this.updateFeedsCount(false);
        });
    }

    onShowBookmark() {
        this.dataHelper.getBookmarkNews(0, this.entriesPerPage).then((entries) => {
            this.entries = entries;

            this.setState({
                entries: entries,
                type: 3
            });

            this.updateFeedsCount(false);
        });
    }

    updateFeedsCount(unviewed) {
        const feeds = [...this.state.feeds];

        feeds.forEach(feed => {
            const count = this.entries.filter(entry => {
                if (unviewed) {
                    return entry.feedId === feed.id && entry.isViewed !== true
                }

                return entry.feed_id === feed.id;
            }).length;

            feed.count = count;
        });

        this.setState({
            feeds: feeds
        });
    }

    onUpdateViewed(ids) {
        if (this.state.type === 0) {    
            this.updateFeedsCount(true);
            this.dataHelper.markAsViewed(ids);
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
                return feeds[entry.feed_id];
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

            this.setState({
                feeds: feeds,
                entries: response.items,
                isUpdating: false
            });
            
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