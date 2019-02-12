import React from 'react';
import { Entry } from './Entry.js';

import styles from './List.module.css';

export class EntriesList extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                {this.props.entries.map((entry, i) => {
                    return (<Entry key={entry.id} title={entry.title} description={entry.description} link={entry.link} feedIcon={entry.feed.icon} feedTitle={entry.feed.title} />)
                })}
            </div>
        );
    }
}