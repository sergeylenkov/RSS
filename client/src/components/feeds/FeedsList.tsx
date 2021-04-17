import { feedsEditing, feedsSelect } from '../../store/actions';

import { Dispatch } from 'redux';
import { Feed } from '../../data';
import FeedEdit from './FeedEdit';
import FeedItem from './FeedItem';
import React from 'react';
import { connect } from 'react-redux';

import './FeedsList.scss';

interface MapStateToProps {
  isFeedsEditing: boolean;
  feeds: Feed[];
  selectedFeeds: number[];
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
  public state: FeedsListState = {
    isEditing: false
  };

  public render() {
    const {
      feeds,
      selectedFeeds,
      isFeedsEditing,
      onAddFeed,
      feedsEditing,
      onDeleteFeed,
      feedsSelect,
      onChangeFeed
    } = this.props;

    return (
      <div className='feeds-list'>
        {
          feeds.map((feed: Feed) => {
            const isSelected = selectedFeeds.includes(feed.id);

            return (
              <FeedItem
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
