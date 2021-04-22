import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { feedsEditing, feedsSelect } from '../../store/actions';
import { State } from '../../store/reducers';
import { Feed } from '../../data';
import FeedEdit from './FeedEdit';
import FeedItem from './FeedItem';

import './FeedsList.scss';

interface FeedsListProps {
  onAddFeed: (link: string) => void;
  onChangeFeed: (id: number, title: string) => void;
  onDeleteFeed: (id: number) => void;
}

function FeedsList({ onAddFeed, onChangeFeed, onDeleteFeed }: FeedsListProps): JSX.Element {
  const dispatch = useDispatch();
  const isFeedsEditing = useSelector<State, boolean>(state => state.isFeedsEditing);
  const feeds = useSelector<State, Feed[]>(state => state.feeds);
  const selectedFeeds = useSelector<State, number[]>(state => state.selectedFeeds);

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
              onSelect={(id: number) => dispatch(feedsSelect(id))}
            />
          )
        })
      }
      <FeedEdit isEditing={isFeedsEditing} onAdd={onAddFeed} onEdit={() => dispatch(feedsEditing(!isFeedsEditing))} />
    </div>
  );
}

export default FeedsList;
