import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Data, { Entry, Feed, UpdateFeedResponse } from './data';
import {
  entriesUpdateError,
  entriesUpdated,
  entriesUpdating,
  feedsAdd,
  feedsDelete,
  feedsEditing,
  feedsUpdate,
  feedsUpdated,
  updateUnviewedCount,
} from './store/actions';

import { useDispatch, useSelector } from 'react-redux';
import { State } from './store/reducers';
import { CSSTransition } from 'react-transition-group';
import EntriesList from './components/entries/EntriesList';
import FeedsList from './components/feeds/FeedsList';
import Menu from './components/menu/Menu';
import Settings from './components/settings/Settings';
import SettingsButton from './components/settings/SettingsButton';

import './App.scss';

function App(): JSX.Element {
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const isGrid = useSelector<State, boolean>((state) => state.isGrid);
  const isDarkTheme = useSelector<State, boolean>((state) => state.isDarkTheme);
  const keepDays = useSelector<State, number>((state) => state.keepDays);
  const dispatch = useDispatch();

  const onUpdate = () => {
    dispatch(entriesUpdating(true));

    Data.update()
      .then((entries: Entry[]) => {
        const unviewed = entries.filter((entry: Entry) => {
          return !entry.isViewed;
        });

        dispatch(entriesUpdated(unviewed));
        dispatch(updateUnviewedCount());
      })
      .catch(() => {
        dispatch(entriesUpdateError());
      });
  };

  const onAddFeed = (link: string) => {
    Data.addFeed(link).then((feed: Feed) => {
      dispatch(feedsAdd(feed));
      dispatch(feedsEditing(false));
    });
  };

  const onChangeFeed = (feed: Feed) => {
    Data.updateFeed(feed).then((response: UpdateFeedResponse) => {
      dispatch(feedsUpdate(response.id, response.feed));
      dispatch(feedsEditing(false));
    });
  };

  const onDeleteFeed = (id: number) => {
    Data.deleteFeed(id).then(() => {
      dispatch(feedsDelete(id));
      dispatch(feedsEditing(false));
    });
  };

  const hideSettings = () => {
    if (isSettingsVisible) {
      onToggleSettings();
    }
  };

  const onToggleSettings = () => {
    const visible = !isSettingsVisible;

    if (visible) {
      document.addEventListener('click', hideSettings);
    } else {
      document.removeEventListener('click', hideSettings);
    }

    setSettingsVisible(visible);
  };

  useEffect(() => {
    Data.getFeeds().then((feeds: Feed[]) => {
      dispatch(feedsUpdated(feeds));
    });

    Data.clearEntries(keepDays);
  }, []);

  return (
    <BrowserRouter>
      <div
        className={`container ${isGrid ? 'grid' : ''} ${
          isDarkTheme ? 'dark' : ''
        }`}
      >
        <div className="header">
          <div className="header__content">
            <Menu onUpdate={onUpdate} />
            <SettingsButton
              isActive={isSettingsVisible}
              onClick={onToggleSettings}
            />

            <CSSTransition
              in={isSettingsVisible}
              timeout={200}
              classNames="fade"
              unmountOnExit
              mountOnEnter
            >
              <Settings isVisible={isSettingsVisible} />
            </CSSTransition>
          </div>
        </div>
        {isGrid && (
          <div className="feeds">
            <FeedsList
              onAddFeed={onAddFeed}
              onChangeFeed={onChangeFeed}
              onDeleteFeed={onDeleteFeed}
            />
          </div>
        )}
        <div className="content">
          <div className="list">
            <EntriesList />
          </div>
          {!isGrid && (
            <div className="feeds">
              <FeedsList
                onAddFeed={onAddFeed}
                onChangeFeed={onChangeFeed}
                onDeleteFeed={onDeleteFeed}
              />
            </div>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
