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
            isUpdating: false
        }

        this.dataHelper = new DataHelper('http://rss/server/api.php?', false);
    }

    componentDidMount() {
        this.dataHelper.getFeeds().then(feeds => {
            console.log(feeds);
            this.dataHelper.getUnviewed().then((entries) => {
                console.log(entries);
                entries.forEach(entry => {
                    entry.feed = this.dataHelper.getFeedById(entry.feed_id);
                });

                this.setState({
                    feeds: feeds,
                    entries: entries
                });

                this.updateFeedsCount();
            });            
        });
    }

    render() {
        return (            
            <div className="application">
                <Menu feeds={this.state.feeds} isUpdating={this.state.isUpdating} onReload={() => this.reload()}/>
                <EntriesList entries={this.state.entries}/>
            </div>
        );
    }

    reload() {
        this.setState({
            isUpdating: true
        });

        this.dataHelper.update().then(data => {
            console.log(data);            
            this.setState({
                entries: data,
                isUpdating: false
            });

            this.updateFeedsCount();
        });
    }

    updateFeedsCount() {
        const feeds = [...this.state.feeds];

        feeds.forEach(feed => {
            const count = this.state.entries.filter(el => {
                return el.feed_id === feed.id;
            }).length;

            feed.count = count;
        });

        this.setState({
            feeds: feeds
        })
    }
}