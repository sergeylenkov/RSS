import React from 'react';
import { Icon, Icons } from '../Icon.js';

import styles from './Entry.module.css';

export class Entry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isViewed: props.entry.isViewed,
            isRead: props.entry.isRead,
            isExpanded: false,
            isFavorite: props.entry.isFavorite
        }

        this.itemElementRef = null;
        this.titleElementRef = null;
        
        this.handleScroll = this.handleScroll.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.onRead = this.onRead.bind(this);
        this.onSetFavorite = this.onSetFavorite.bind(this);

        this.itemRef = element => {
            if (element) {
                this.itemElementRef = element;
            }
        };

        this.titleRef = element => {
            if (element) {
                this.titleElementRef = element;

                this.titleElementRef.addEventListener('mouseup', this.onRead);
            }            
        }
    }

    componentDidMount() {        
        if (!this.state.isViewed) {
            window.addEventListener('scroll', this.handleScroll);
            window.addEventListener('mousemove', this.handleMove);
        }
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('mousemove', this.handleMove);
    }

    render() {
        const entry = this.props.entry;
        const description = this.removeSelfLinks(entry.description, entry.link);
        
        let className = styles.container;

        if (this.state.isRead) {
            className += ` ${styles.read}`;
        }

        let expandButton = null;

        if (this.props.isCollapseLong && !this.state.isExpanded && this.isLong(description)) {
            className += ` ${styles.collapsed}`;
            expandButton = <button className={styles.expandButton} onClick={() => this.expand()}></button>
        }

        return (
            <div className={className} ref={this.itemRef}>
                <div className={styles.title} ref={this.titleRef}><a href={entry.link}>{entry.title}</a></div>
                <div className={styles.feed}><div className={styles.feedIcon} style={{ backgroundImage: `url(${entry.feed.icon})` }}></div><div className={styles.feedTitle}>{entry.feed.title}</div></div>
                <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }}></div>
                {expandButton}
                <div className={styles.info}>
                    <div className={styles.infoItem}><div className={styles.infoIcon} onClick={this.onSetFavorite}><Icon svg={this.state.isFavorite ? Icons.favoriteSelected : Icons.favorite }/></div><div className={styles.infoCounter}>{1}</div></div>
                    <div className={styles.infoItem}><div className={styles.infoIcon}><Icon svg={Icons.read}/></div><div className={styles.infoCounter}>{this.state.isRead}</div></div>
                </div>
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

    isLong(description) {        
        let el = document.createElement('div');       
        el.innerHTML = description;
        
        if (el.getElementsByTagName('img').length > 3) {
            return true;
        }
        
        if (el.innerText.length > 1500) {
            return true;
        }

        return false;
    }

    handleScroll() {
        if (!this.state.isViewed) {
            const rect = this.itemElementRef.getBoundingClientRect();
            const height = window.innerHeight / 2;
            
            let isViewed = false;
            let scrollEnd = false;
            
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
                scrollEnd = true;
            }
            
            if (scrollEnd && rect.top > 0) {
                isViewed = true;
            } else if (rect.top < height) {
                isViewed = true;                
            }

            if (isViewed) {
                this.setState({
                    isViewed: true
                });

                this.props.onView(this.props.entry.id);
            }
        }
    }

    handleMove() {
        if (!this.state.isViewed) {
            const rect = this.itemElementRef.getBoundingClientRect();            
            const height = rect.top + rect.height;
            
            if (height < window.innerHeight) {
                this.setState({
                    isViewed: true
                });
                
                this.props.onView(this.props.entry.id);     
            }        

            window.removeEventListener('mousemove', this.handleMove);
        }
    }

    expand() {
        this.setState({
            isExpanded: true
        });
    }

    onRead() {
        this.props.onRead(this.props.entry.id);

        this.setState({
            isRead: true
        });
    }

    onSetFavorite() {
        const isFavorite = !this.state.isFavorite;
        
        this.props.onSetFavorite(this.props.entry.id, isFavorite);

        this.setState({
            isFavorite: isFavorite
        });
    }
}