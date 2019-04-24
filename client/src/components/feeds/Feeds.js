import React from 'react';
import { Feed } from './Feed.js';

import styles from './Feeds.module.css';

export class FeedsList extends React.Component {
    render() {
        return (
            <div className={styles.container}>                
            {
                this.props.feeds.map((feed) => {                        
                    return <Feed key={feed.id} feed={feed} />
                })
            }
            </div>
        );
    }
}