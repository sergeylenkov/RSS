import React from 'react';

import styles from './Entry.module.css';

export class Entry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isViewed: false,
            isRead: props.isRead
        }

        this.itemRef = element => {
            this.elementRef = element;
        };

        this.titleRef = element => {
            element.addEventListener('mouseup', () => {               
                this.props.onRead(this.props.entry.id);
                this.setState({
                    isRead: true
                });
            });
        }
        
        this.handleScroll = this.handleScroll.bind(this);
        this.handleMove = this.handleMove.bind(this);
    }

    componentDidMount() {
        if (!this.state.isViewed) {
            window.addEventListener('scroll', this.handleScroll);
            window.addEventListener('mousemove', this.handleMove);
        }
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        const entry = this.props.entry;
        const description = this.removeSelfLinks(entry.description, entry.link);
        
        let className = styles.container;

        if (this.state.isRead) {
            className += ` ${styles.read}`;
        }

        return (
            <div className={className} ref={this.itemRef}>
                <div className={styles.title} ref={this.titleRef}><a href={entry.link}>{entry.title}</a></div>
                <div className={styles.feed}><div className={styles.feedIcon} style={{ backgroundImage: `url(${entry.feed.icon})` }}></div><div className={styles.feedTitle}>{entry.feed.title}</div></div>
                <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }}></div>
            </div>
        );
    }

    removeSelfLinks(description, link) {
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
            
            let viewed = false;
            let scrollEnd = false;

            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                scrollEnd = true;
            }

            if (scrollEnd && rect.top > 0) {
                viewed = true;
            } else if (rect.top < height) {
                viewed = true;                
            }

            if (viewed) {
                this.props.entry.viewed = true;

                this.setState({
                    isViewed: true
                });

                this.props.onView(this.props.entry.id);
            }
        }
    }

    handleMove() {
        if (!this.state.isViewed) {
            const rect = this.elementRef.getBoundingClientRect();
            
            if (rect.top < window.innerHeight) { 
                this.setState({
                    isViewed: true
                });

                this.props.onView(this.props.entry.id);
                console.log('handleMove', rect, window.innerHeight);        
            }        

            window.removeEventListener('mousemove', this.handleMove);
        }
    }
}