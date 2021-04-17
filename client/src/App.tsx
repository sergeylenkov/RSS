import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
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
  updateUnviewedCount
} from './store/actions';

import { CSSTransition } from 'react-transition-group';
import { Dispatch } from 'redux';
import EntriesList from './components/entries/EntriesList';
import FeedsList from './components/feeds/FeedsList';
import Menu from './components/menu/Menu';
import Settings from './components/settings/Settings';
import SettingsButton from './components/settings/SettingsButton';
import { connect } from 'react-redux';

import './App.scss';

interface MapStateToProps {
  isDarkTheme: boolean;
  isGrid: boolean;
  keepDays: number;
  entriesUpdating: (isUpdating: boolean) => void;
  updateUnviewedCount: () => void;
  entriesUpdated: (entries: Entry[]) => void;
  feedsUpdated: (feeds: Feed[]) => void;
  entriesUpdateError: () => void;
  feedsDelete: (id: number) => void;
  feedsUpdate: (id: number, data: any) => void;
  feedsEditing: (isEditing: boolean) => void;
  feedsAdd: (feed: any) => void;
}

type AppProps = MapStateToProps;

interface AppState {
  isSettingsVisible: boolean;
}

class App extends React.Component<AppProps, AppState> {
  public state: AppState = {
    isSettingsVisible: false
  };

  public componentDidMount() {
    const { feedsUpdated, keepDays } = this.props;

    Data.getFeeds().then((feeds: Feed[]) => {
      feedsUpdated(feeds);
    });

    Data.clearEntries(keepDays);
  }

  private onUpdate = () => {
    const { entriesUpdated, entriesUpdating, updateUnviewedCount, entriesUpdateError } = this.props;

    entriesUpdating(true);

    Data.update().then((entries: Entry[]) => {
      const unviewed = entries.filter((entry: Entry) => {
        return !entry.isViewed;
      });

      entriesUpdated(unviewed);
      updateUnviewedCount();
    }).catch((error: any) => {
      console.log(error);
      entriesUpdateError();
    });
  };

  private onAddFeed = (link: string) => {
    const { feedsAdd, feedsEditing } = this.props;

    Data.addFeed(link).then((feed: Feed) => {
      feedsAdd(feed);
      feedsEditing(false);
    }).catch((error: any) => {
      console.log(error);
    });
  };

  private onChangeFeed = (id: number, data: any) => {
    const { feedsUpdate, feedsEditing } = this.props;

    Data.updateFeed(id, data).then((data: UpdateFeedResponse) => {
      feedsUpdate(id, data.data);
      feedsEditing(false);
    });
  };

  private onDeleteFeed = (id: number) => {
    const { feedsDelete, feedsEditing } = this.props;

    Data.deleteFeed(id).then(() => {
      feedsDelete(id);
      feedsEditing(false);
    });
  };

  private onToggleSettings = () => {
    const { isSettingsVisible } = this.state;
    const visible = !isSettingsVisible;

    if (visible) {
      document.addEventListener('click', this.hideSettings);
    } else {
      document.removeEventListener('click', this.hideSettings);
    }

    this.setState({
      isSettingsVisible: visible
    });
  };

  private hideSettings = () => {
    const { isSettingsVisible } = this.state;

    if (isSettingsVisible) {
      this.onToggleSettings();
    }
  };

  public render() {
    const { isGrid, isDarkTheme } = this.props;
    const { isSettingsVisible } = this.state;

    return (
      <BrowserRouter>
        <div className={`container ${isGrid ? 'grid' : ''} ${isDarkTheme ? 'dark' : ''}`}>
          <div className='header'>
            <div className='header__content'>
              <Menu
                onUpdate={this.onUpdate}
              />
              <SettingsButton isActive={isSettingsVisible} onClick={this.onToggleSettings} />

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
          {isGrid &&
            <div className='feeds'>
              <FeedsList onAddFeed={this.onAddFeed} onChangeFeed={this.onChangeFeed} onDeleteFeed={this.onDeleteFeed} />
            </div>
          }
          <div className='content'>
            <Switch>
              <Route path='/'>
                <div className='list'>
                  <EntriesList />
                </div>
              </Route>
            </Switch>
            {!isGrid &&
              <div className='feeds'>
                <FeedsList onAddFeed={this.onAddFeed} onChangeFeed={this.onChangeFeed} onDeleteFeed={this.onDeleteFeed} />
              </div>
            }
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

/* Redux */

const mapStateToProps = (state: MapStateToProps) => {
  return {
    isDarkTheme: state.isDarkTheme,
    isGrid: state.isGrid,
    keepDays: state.keepDays,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    feedsUpdated: (feeds: Feed[]) => dispatch(feedsUpdated(feeds)),
    entriesUpdating: (isUpdating: boolean) => dispatch(entriesUpdating(isUpdating)),
    entriesUpdated: (entries: Entry[]) => dispatch(entriesUpdated(entries)),
    updateUnviewedCount: () => dispatch(updateUnviewedCount()),
    feedsAdd: (feed: Feed) => dispatch(feedsAdd(feed)),
    feedsDelete: (id: number) => dispatch(feedsDelete(id)),
    feedsUpdate: (id: number, data: any) => dispatch(feedsUpdate(id, data)),
    feedsEditing: (isEditing: boolean) => dispatch(feedsEditing(isEditing)),
    entriesUpdateError: () => dispatch(entriesUpdateError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App)
