import React from 'react';
import { Feed } from './Feed.js';
import { FeedEdit } from './Edit.js';
import { connect } from 'react-redux';
import { feedsEditing } from '../../store/actions/index.js';

import styles from './Feeds.module.css';

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
    }

    render() {
        return (
            <div className={styles.container}>
            {
                this.props.feeds.map((feed) => {
                    return <Feed key={feed.id} feed={feed} isEditing={this.props.isFeedsEditing} onDelete={this.onDelete} onChange={this.onChange} />
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
        console.log(id, title);
        this.props.onChangeFeed(id, { title: title });
    }

    onDelete(id) {
        console.log(id);
    }

    onEdit() {
        /*this.setState({
            isEditing: !this.state.isEditing
        });*/
        this.props.feedsEditing(!this.props.isFeedsEditing);
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        isFeedsEditing: state.isFeedsEditing,
        feeds: state.feeds
    };
};

const mapDispatchToProps = dispatch => {
    return {
        feedsEditing: (isEditing) => dispatch(feedsEditing(isEditing))
    };
};

export const FeedsList = connect(mapStateToProps, mapDispatchToProps)(ConnectedFeedsList);