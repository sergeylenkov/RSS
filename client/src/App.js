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
        this.dataHelper.feeds().then(data => {
            console.log(data);
            this.setState({
                feeds: data
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
                isUpdating: false
            });
        });
    }
}