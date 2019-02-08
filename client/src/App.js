import React from 'react';
import { Menu } from './components/menu/Menu.js';
import { DataHelper } from './data/DataHelper.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            feeds: []
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
                <Menu feeds={this.state.feeds}/>
            </div>
        );
    }
}