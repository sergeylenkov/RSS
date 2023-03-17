import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  feedsAdd,
  feedsDelete,
  feedsEditing,
  feedsSelect,
  feedsUpdate,
} from '../../store/actions';
import { State } from '../../store/reducers';
import {
  addFeed,
  deleteFeed,
  Feed,
  updateFeed,
  UpdateFeedResponse,
} from '../../data';
import { FeedEdit } from './FeedEdit';
import { FeedItem } from './FeedItem';

import './FeedsList.scss';

export function FeedsList(): JSX.Element {
  const dispatch = useDispatch();
  const isFeedsEditing = useSelector<State, boolean>(
    (state) => state.isFeedsEditing
  );
  const feeds = useSelector<State, Feed[]>((state) => state.feeds);
  const selectedFeeds = useSelector<State, number[]>(
    (state) => state.selectedFeeds
  );

  const onAddFeed = (link: string) => {
    addFeed(link).then((feed: Feed) => {
      dispatch(feedsAdd(feed));
      dispatch(feedsEditing(false));
    });
  };

  const onChangeFeed = (feed: Feed) => {
    updateFeed(feed).then((response: UpdateFeedResponse) => {
      dispatch(feedsUpdate(response.id, response.feed));
      dispatch(feedsEditing(false));
    });
  };

  const onDeleteFeed = (id: number) => {
    deleteFeed(id).then(() => {
      dispatch(feedsDelete(id));
      dispatch(feedsEditing(false));
    });
  };

  const onChange = (id: number, title: string) => {
    const feed = feeds.find((el) => el.id === id);

    if (feed) {
      feed.title = title;
      onChangeFeed(feed);
    }
  };

  return (
    <div className="feeds-list">
      {feeds.map((feed: Feed) => {
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
            onChange={onChange}
            onSelect={(id: number) => dispatch(feedsSelect(id))}
          />
        );
      })}
      <FeedEdit
        isEditing={isFeedsEditing}
        onAdd={onAddFeed}
        onEdit={() => dispatch(feedsEditing(!isFeedsEditing))}
      />
    </div>
  );
}
