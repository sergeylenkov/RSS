import React from 'react';
import { ReloadButton } from './ReloadButton.js';
import { MenuButton } from './MenuButton.js';

import styles from './Menu.module.css';

export class Menu extends React.Component {
    constructor(props) {
        super(props);

        
    }

    render() {
        return (
            <div className={styles.container}>
                <ReloadButton />

                <div className={styles.feeds}>
                    {this.props.feeds.map((feed, i) => {
                        const a = document.createElement('a');
                        a.href = feed.link;

                        const icon = `${a.protocol}//${a.hostname}/favicon.ico`;
                        
                        return (<MenuButton key={feed.id} icon={icon} title={feed.title} count={feed.count} />)
                    })}
                </div>
            </div>
        );
    }
}