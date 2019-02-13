import React from 'react';
import { Entry } from './Entry.js';

import styles from './List.module.css';

export class EntriesList extends React.Component {
    render() {        
        return (
            <div className={styles.container}>
                {
                    this.props.entries.map((entry) => {
                        const isRead = parseInt(entry.read);
                        return <Entry key={entry.id} entry={entry} isRead={isRead} />
                    })
                }
            </div>
        );
    }
}