import React from 'react';
import { Feed } from './Feed.js';
import { FeedEdit } from './Edit.js';
import { connect } from 'react-redux';
import { feedsEditing, feedsSelect } from '../../store/actions/index.js';

import lightStyles from './Feeds.module.css';
import darkStyles from './Feeds.dark.module.css';

class ConnectedFeedsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditing: false
        }

        this.onAdd = this.onAdd.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    render() {
        let styles = {};

        if (this.props.isDarkTheme) {
            styles = {...lightStyles, ...darkStyles};
        } else {
            styles = lightStyles;
        }

        return (
            <div className={styles.container}>
            {
                this.props.feeds.map((feed) => {
                    const isSelected = this.props.selectedFeeds.includes(feed.id);

                    return (
                        <Feed
                            key={feed.id}
                            icon={feed.icon}
                            title={feed.title}
                            count={feed.count}
                            isSelected={isSelected}
                            isEditing={this.props.isFeedsEditing}
                            onDelete={this.onDelete}
                            onChange={this.onChange}
                            onSelect={this.onSelect}
                        />
                    )
                })
            }
            <FeedEdit isEditing={this.props.isFeedsEditing} onAdd={this.onAdd} onEdit={this.onEdit} />
            </div>
        );
    }

    onAdd(link) {
        this.props.onAddFeed(link);
    }

    onChange(id, title) {
        this.props.onChangeFeed(id, { title: title });
    }

    onDelete(id) {
        this.props.onDeleteFeed(id);
    }

    onSelect(id) {
        this.props.feedsSelect(id);
    }

    onEdit() {
        this.props.feedsEditing(!this.props.isFeedsEditing);
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        isDarkTheme: state.isDarkTheme,
        isFeedsEditing: state.isFeedsEditing,
        feeds: state.feeds,
        selectedFeeds: state.selectedFeeds
    };
};

const mapDispatchToProps = dispatch => {
    return {
        feedsEditing: (isEditing) => dispatch(feedsEditing(isEditing)),
        feedsSelect: (id) => dispatch(feedsSelect(id))
    };
};

export const FeedsList = connect(mapStateToProps, mapDispatchToProps)(ConnectedFeedsList);