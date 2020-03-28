import { feedsEditing, feedsSelect } from '../../store/actions';

import Feed from './Feed';
import FeedEdit from './Edit';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import darkStyles from './Feeds.dark.module.css';
import lightStyles from './Feeds.module.css';

interface MapStateToProps {
  isDarkTheme: boolean,
  isFeedsEditing: boolean,
  feeds: any[],
  selectedFeeds: number[],
  feedsSelect: (id: number) => void;
  feedsEditing: (isFeedsEditing: boolean) => void;
}

interface FeedsListProps extends MapStateToProps {
  onAddFeed: (link: string) => void;
  onChangeFeed: (id: number, title: string) => void;
  onDeleteFeed: (id: number) => void;
}

interface FeedsListState {
  isEditing: boolean;
}

class FeedsList extends React.Component<FeedsListProps, FeedsListState> {
  state = {
    isEditing: false
  };

  public render() {
    const {
      isDarkTheme,
      feeds,
      selectedFeeds,
      isFeedsEditing,
      onAddFeed,
      feedsEditing,
      onDeleteFeed,
      feedsSelect,
      onChangeFeed
    } = this.props;

    let styles = lightStyles;

    if (isDarkTheme) {
      styles = { ...lightStyles, ...darkStyles };
    }

    return (
      <div className={styles.container}>
        {
          feeds.map((feed) => {
            const isSelected = selectedFeeds.includes(feed.id);

            return (
              <Feed
                key={feed.id}
                id={feed.id}
                icon={feed.icon}
                title={feed.title}
                count={feed.count}
                isSelected={isSelected}
                isEditing={isFeedsEditing}
                onDelete={onDeleteFeed}
                onChange={onChangeFeed}
                onSelect={feedsSelect}
              />
            )
          })
        }
        <FeedEdit isEditing={isFeedsEditing} onAdd={onAddFeed} onEdit={() => feedsEditing(!isFeedsEditing)} />
      </div>
    );
  }
}

/* Redux */

const mapStateToProps = (state: MapStateToProps) => {
  return {
    isDarkTheme: state.isDarkTheme,
    isFeedsEditing: state.isFeedsEditing,
    feeds: state.feeds,
    selectedFeeds: state.selectedFeeds
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    feedsEditing: (isEditing: boolean) => dispatch(feedsEditing(isEditing)),
    feedsSelect: (id: number) => dispatch(feedsSelect(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedsList);
