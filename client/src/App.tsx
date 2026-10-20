import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { clearEntries, Feed, getFeeds } from './data';
import { feedsUpdated } from './store/actions';
import { useAppDispatch } from './store/hooks';
import { useSelector } from 'react-redux';
import { State } from './store/reducers';
import { EntriesList } from './components/entries/EntriesList';
import { FeedsList } from './components/feeds/FeedsList';
import { Menu } from './components/menu/Menu';
import { Settings } from './components/settings/Settings';

import './App.scss';

function App(): React.JSX.Element {
  const isGrid = useSelector<State, boolean>((state) => state.isGrid);
  const isDarkTheme = useSelector<State, boolean>((state) => state.isDarkTheme);
  const keepDays = useSelector<State, number>((state) => state.keepDays);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getFeeds().then((feeds: Feed[]) => {
      dispatch(feedsUpdated(feeds));
    });

    clearEntries(keepDays);
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
            <Menu />
            <Settings />
          </div>
        </div>
        {isGrid && (
          <div className="feeds">
            <FeedsList />
          </div>
        )}
        <div className="content">
          <div className="list">
            <EntriesList />
          </div>
          {!isGrid && (
            <div className="feeds">
              <FeedsList />
            </div>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
