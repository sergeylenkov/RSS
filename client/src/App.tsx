import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Data, Entry, Feed, UpdateFeedResponse } from './data';
import {
  entriesUpdateError,
  entriesUpdated,
  entriesUpdating,
  feedsAdd,
  feedsDelete,
  feedsEditing,
  feedsUpdate,
  feedsUpdated,
  updateEntriesCount,
  updateUnviewedCount,
  updateViewed
} from './store/actions';

import { CSSTransition } from 'react-transition-group';
import { Dispatch } from "redux";
import EntriesList from './components/entries/List';
import FeedsList from './components/feeds/Feeds';
import Menu from './components/menu/Menu';
import React from 'react';
import Settings from './components/settings/Settings';
import SettingsButton from './components/settings/Button';
import { connect } from 'react-redux';
import darkStyles from './App.dark.module.css';
import lightStyles from './App.module.css';

interface MapStateToProps {
  isDarkTheme: boolean;
  keepDays: number;
  entriesUpdating: (isUpdating: boolean) => void;
  updateUnviewedCount: () => void;
  updateEntriesCount: () => void;
  updateRead: (id: number, isRead: boolean) => void;
  entriesUpdated: (entries: Entry[]) => void;
  feedsUpdated: (feeds: Feed[]) => void;
  entriesUpdateError: () => void;
  updateViewed: (ids: number[]) => void;
  updateFavorite: (id: number, isFavorite: boolean) => void;
  feedsDelete: (id: number) => void;
  feedsUpdate: (id: number, data: any) => void;
  feedsEditing: (isEditing: boolean) => void;
  feedsAdd: (feed: any) => void;
}

interface AppProps extends MapStateToProps {
}

interface AppState {
  isSettingsVisible: boolean;
}

class App extends React.Component<AppProps, AppState> {
  public state: AppState = {
    isSettingsVisible: false
  };

  private dataHelper: Data = new Data('http://localhost:8080/');

  public componentDidMount() {
    const { feedsUpdated, keepDays } = this.props;

    this.dataHelper.getFeeds().then((feeds: Feed[]) => {
      feedsUpdated(feeds);
    });

    this.dataHelper.clearEntries(keepDays).then(days => {

    });
  }

  private onUpdate = () => {
    const { entriesUpdated, entriesUpdating, updateUnviewedCount, entriesUpdateError } = this.props;

    entriesUpdating(true);
    //changeViewMode(0);

    this.dataHelper.update().then((entries: Entry[]) => {
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

    this.dataHelper.addFeed(link).then((feed: any) => {
      feedsAdd(feed);
      feedsEditing(false);
    }).catch((error: any) => {
      console.log(error);
    });
  };

  private onChangeFeed = (id: number, data: any) => {
    const { feedsUpdate, feedsEditing } = this.props;

    this.dataHelper.updateFeed(id, data).then((data: UpdateFeedResponse) => {
      feedsUpdate(id, data.data);
      feedsEditing(false);
    });
  };

  private onDeleteFeed = (id: number) => {
    const { feedsDelete, feedsEditing } = this.props;

    this.dataHelper.deleteFeed(id).then((data: any) => {
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
    const { isDarkTheme } = this.props;
    const { isSettingsVisible } = this.state;

    let styles = lightStyles;

    if (isDarkTheme) {
      styles = { ...lightStyles, ...darkStyles };
    }

    return (
      <BrowserRouter>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
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
          <div className={styles.content}>
            <Switch>
              <Route path='/'>
                <div className={styles.list}>
                  <EntriesList />
                </div>
              </Route>
            </Switch>
            <div className={styles.feeds}>
              <FeedsList onAddFeed={this.onAddFeed} onChangeFeed={this.onChangeFeed} onDeleteFeed={this.onDeleteFeed} />
            </div>
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
    keepDays: state.keepDays
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    feedsUpdated: (feeds: Feed[]) => dispatch(feedsUpdated(feeds)),
    entriesUpdating: (isUpdating: boolean) => dispatch(entriesUpdating(isUpdating)),
    entriesUpdated: (entries: Entry[]) => dispatch(entriesUpdated(entries)),
    updateUnviewedCount: () => dispatch(updateUnviewedCount()),
    updateEntriesCount: () => dispatch(updateEntriesCount()),
    updateViewed: (ids: number[]) => dispatch(updateViewed(ids)),
    feedsAdd: (feed: Feed) => dispatch(feedsAdd(feed)),
    feedsDelete: (id: number) => dispatch(feedsDelete(id)),
    feedsUpdate: (id: number, data: any) => dispatch(feedsUpdate(id, data)),
    feedsEditing: (isEditing: boolean) => dispatch(feedsEditing(isEditing)),
    entriesUpdateError: () => dispatch(entriesUpdateError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App)
