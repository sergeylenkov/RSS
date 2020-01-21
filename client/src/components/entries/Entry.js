import React from 'react';
import { connect } from 'react-redux';
import { FavoriteSelectedIcon, FavoriteIcon, ReadIcon } from '../Icons.js';

import lightStyles from './Entry.module.css';
import darkStyles from './Entry.dark.module.css';

export class ConnectedEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false
        }

        this.itemElementRef = null;
        this.titleElementRef = null;

        this.handleScroll = this.handleScroll.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.onRead = this.onRead.bind(this);
        this.onSetFavorite = this.onSetFavorite.bind(this);
        this.onExpand = this.onExpand.bind(this);

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
        if (!this.props.entry.isViewed) {
            window.addEventListener('scroll', this.handleScroll);
            window.addEventListener('mousemove', this.handleMove);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('mousemove', this.handleMove);
    }

    render() {
        let styles = {};

        if (this.props.isDarkTheme) {
            styles = {...lightStyles, ...darkStyles};
        } else {
            styles = lightStyles;
        }

        const entry = this.props.entry;
        const description = this.removeSelfLinks(entry.description, entry.link);

        let readIcon = null;

        if (this.props.entry.isRead) {
            readIcon = <div className={styles.infoItem}><div className={styles.infoIcon}><ReadIcon /></div></div>;
        }

        let className = styles.container;
        let expandButton = null;

        if (this.props.isCollapseLong && !this.state.isExpanded && this.isLong(description)) {
            className += ` ${styles.collapsed}`;
            expandButton = <button className={styles.expandButton} onClick={this.onExpand}></button>
        }

        return (
            <div className={className} ref={this.itemRef}>
                <div className={styles.title} ref={this.titleRef}><a href={entry.link}>{entry.title}</a></div>
                <div className={styles.feed}><div className={styles.feedIcon} style={{ backgroundImage: `url(${entry.feed.icon})` }}></div><div className={styles.feedTitle}>{entry.feed.title}</div></div>
                <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }}></div>
                {expandButton}
                <div className={styles.info}>
                    <div className={styles.infoItem}>
                        <div className={styles.infoIcon} onClick={this.onSetFavorite}>
                            {this.props.entry.isFavorite ? <FavoriteSelectedIcon /> : <FavoriteIcon /> }
                        </div>
                    </div>
                    {readIcon}
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
        if (!this.props.entry.isViewed) {
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
                this.props.onView(this.props.entry.id);
            }
        }
    }

    handleMove() {
        if (!this.props.entry.isViewed) {
            const rect = this.itemElementRef.getBoundingClientRect();
            const height = rect.top + rect.height;

            if (height < window.innerHeight) {
                this.props.onView(this.props.entry.id);
            }

            window.removeEventListener('mousemove', this.handleMove);
        }
    }

    onExpand() {
        this.setState({
            isExpanded: true
        });

        this.onRead();
    }

    onRead() {
        if (!this.props.entry.isRead) {
            this.props.onRead(this.props.entry.id);
        }
    }

    onSetFavorite() {
        this.props.onSetFavorite(this.props.entry.id, !this.props.entry.isFavorite);
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        isDarkTheme: state.isDarkTheme
    };
};

export const Entry = connect(mapStateToProps)(ConnectedEntry);