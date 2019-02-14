import React from 'react';

import styles from './Entry.module.css';

export class Entry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isViewed: false
        }

        this.itemRef = element => {
            this.elementRef = element;  
        };

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        const entry = this.props.entry;
        const description = this.clearSelfLinks(entry.description, entry.link);
        
        let className = styles.container;

        if (this.props.isRead) {
            className += ` ${styles.read}`;
        }

        return (
            <div className={className} ref={this.itemRef}>
                <div className={styles.title}><a href={entry.link}>{entry.title}</a></div>
                <div className={styles.feed}><div className={styles.feedIcon} style={{ backgroundImage: `url(${entry.feed.icon})` }}></div><div className={styles.feedTitle}>{entry.feed.title}</div></div>
                <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }}></div>
            </div>
        );
    }

    clearSelfLinks(description, link) {
        let el = document.createElement('div');       
        el.innerHTML = description;
        
        let items = Array.from(el.getElementsByTagName('a'));

        let links = items.filter((item) => {
            let href = item.getAttribute('href');
    
            if (href && href.indexOf(link) !== -1) {
                return true;
            }
    
            return false;
        });
    
        for (let i = 0; i < links.length; i++) {
            links[i].remove();
        }
    
        return el.innerHTML;
    }

    handleScroll() {
        if (!this.state.isViewed) {
            const rect = this.elementRef.getBoundingClientRect();
            const height = window.innerHeight / 2;
           
            if (rect.top < height) {
                this.props.entry.viewed = true;

                this.setState({
                    isViewed: true
                });

                this.props.onView(this.props.entry.id);
            }
        }
    }
}