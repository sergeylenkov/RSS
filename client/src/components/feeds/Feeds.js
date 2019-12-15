import React from 'react';
import { Feed } from './Feed.js';
import { FeedEdit } from './Edit.js';
import { connect } from 'react-redux';

import styles from './Feeds.module.css';

class ConnectedFeedsList extends React.Component {
    render() {
        return (
            <div className={styles.container}>                
            {
                this.props.feeds.map((feed) => {                        
                    return <Feed key={feed.id} feed={feed} />
                })
            }
            <FeedEdit onAdd={(link) => this.onAddFeed(link)}/>
            </div>
        );
    }

    onAddFeed(link) {
        this.props.onAddFeed(link);
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        feeds: state.feeds
    };
};

export const FeedsList = connect(mapStateToProps)(ConnectedFeedsList);