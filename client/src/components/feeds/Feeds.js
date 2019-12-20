import React from 'react';
import { Feed } from './Feed.js';
import { FeedEdit } from './Edit.js';
import { connect } from 'react-redux';

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
                    return <Feed key={feed.id} feed={feed} isEditing={this.state.isEditing} onDelete={this.onDelete} onChange={this.onChange} />
                })
            }
            <FeedEdit isEditing={this.state.isEditing} onAdd={this.onAdd} onEdit={this.onEdit} />
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
        this.setState({
            isEditing: !this.state.isEditing
        });
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        feeds: state.feeds
    };
};

export const FeedsList = connect(mapStateToProps)(ConnectedFeedsList);