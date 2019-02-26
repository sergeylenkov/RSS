import React from 'react';
import { Menu } from './components/menu/Menu.js';
import { EntriesList } from './components/entries/List.js';
import { DataHelper } from './data/DataHelper.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.entries = [];

        this.state = {
            feeds: [],
            entries: [],
            selectedFeeds: {},
            isUpdating: false
        }

        this.dataHelper = new DataHelper('http://rss/server/api.php?', false);
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
                    selectedFeeds: selectedFeeds
                });

                this.updateFeedsCount(false);
            });            
        });
    }

    render() {
        return (            
            <div className="application">
                <Menu feeds={this.state.feeds} selectedFeeds={this.state.selectedFeeds} isUpdating={this.state.isUpdating} 
                    onReload={() => this.reload()} onFeedSelect={(id) => this.onFeedSelect(id)} onFeedDelete={(id) => this.onFeedDelete(id)} onAddFeed={(feed) => this.onAddFeed(feed)} />
                <EntriesList entries={this.state.entries} onUpdateViewed={(ids) => this.onUpdateViewed(ids)} onUpdateReaded={(id) => this.onUpdateReaded(id)} />
            </div>
        );
    }

    reload() {
        this.setState({
            isUpdating: true
        });

        this.dataHelper.update().then(entries => {
            console.log(entries);
            this.entries = entries;

            this.setState({
                entries: entries,
                isUpdating: false
            });

            this.updateFeedsCount(false);
        });
    }

    updateFeedsCount(unviewed) {
        const feeds = [...this.state.feeds];

        feeds.forEach(feed => {
            const count = this.entries.filter(entry => {
                if (unviewed) {
                    return entry.feed_id === feed.id && entry.viewed !== true
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
        this.updateFeedsCount(true);
        this.dataHelper.markAsViewed(ids);
    }

    onUpdateReaded(id) {
        this.dataHelper.markAsRead(id);
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
                if (feed.id == id) {
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
}