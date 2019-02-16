import React from 'react';
import { Menu } from './components/menu/Menu.js';
import { EntriesList } from './components/entries/List.js';
import { DataHelper } from './data/DataHelper.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);

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
                <Menu feeds={this.state.feeds} selectedFeeds={this.state.selectedFeeds} isUpdating={this.state.isUpdating} onReload={() => this.reload()} onFeedSelect={(id) => this.onFeedSelect(id)} />
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
            const count = this.state.entries.filter(entry => {
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
        //this.dataHelper.markAsViewed(ids);
    }

    onUpdateReaded(id) {
        this.dataHelper.markAsRead(id);
    }

    onFeedSelect(id) {
        let feeds = this.state.selectedFeeds;
        feeds[id] = !feeds[id];

        this.setState({
            selectedFeeds: feeds
        });

        console.log('onFeedSelect', id);
        console.log(feeds);
    }
}