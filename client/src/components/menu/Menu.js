import React from 'react';
import { ReloadButton } from './ReloadButton.js';
import { MenuButton } from './MenuButton.js';
import { MenuEdit } from './edit/Edit.js';

import styles from './Menu.module.css';

export class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isScrolled: false
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
                            return (<MenuButton key={feed.id} feed={feed} onClick={(id) => this.onFeedSelect(id)} />)
                        })
                    }
                </div>

                <MenuEdit isDisabled={this.props.isUpdating} isScrolled={this.state.isScrolled} onEdit={() => this.onEdit()}/>
            </div>
        );
    }

    onEdit() {

    }

    onFeedSelect(id) {

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