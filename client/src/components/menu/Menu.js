import React from 'react';
import { ReloadButton } from './ReloadButton.js';
import { MenuButton } from './MenuButton.js';
import { MenuEdit } from './edit/Edit.js';

import styles from './Menu.module.css';

export class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isScrolled: false,
            isEdited: false
        }

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        let className = styles.container;

        if (this.state.isScrolled) {
            className += ` ${styles.scrolled}`;
        }

        return (
            <div className={className}>
                <ReloadButton isActive={this.props.isUpdating} onClick={() => this.props.onReload()}/>

                <div className={styles.feeds}>
                    {
                        this.props.feeds.map((feed, i) => {
                            const selected = this.props.selectedFeeds[feed.id];

                            return (<MenuButton key={feed.id} feed={feed} isSelected={selected} isEdited={this.state.isEdited} onClick={(id) => this.props.onFeedSelect(id)} onDelete={(id) => this.props.onFeedDelete(id)} />)
                        })
                    }
                </div>

                <MenuEdit isDisabled={this.props.isUpdating} isScrolled={this.state.isScrolled} isEdited={this.state.isEdited} onEdit={() => this.onEdit()} onAddFedd={(feed) => this.props.onAddFeed(feed)}/>
            </div>
        );
    }

    onEdit() {
        const edited = !this.state.isEdited;

        this.setState({
            isEdited: edited
        });
    }

    handleScroll() {
        let scrolled = false;

        if (window.scrollY > 80) {
			scrolled = true;
		}
        
        this.setState({
            isScrolled: scrolled
        });
    }
}