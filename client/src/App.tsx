import {
  changeViewMode,
  entriesUpdateError,
  entriesUpdated,
  entriesUpdating,
  feedsAdd,
  feedsDelete,
  feedsEditing,
  feedsUpdate,
  feedsUpdated,
  updateEntriesCount,
  updateFavorite,
  updateRead,
  updateUnviewedCount,
  updateViewed
} from './store/actions';

import { CSSTransition } from 'react-transition-group';
import { DataHelper } from './data/DataHelper';
import { EntriesList } from './components/entries/List';
import { FeedsList } from './components/feeds/Feeds';
import { Menu } from './components/menu/Menu';
import React from 'react';
import { Settings } from './components/settings/Settings';
import { SettingsButton } from './components/settings/Button';
import { connect } from 'react-redux';
import darkStyles from './App.dark.module.css';
import lightStyles from './App.module.css';

interface AppProps {
  isDarkTheme: boolean;
  entriesUpdating: () => void;
  changeViewMode: (mode: number) => void;
  updateUnviewedCount: () => void;
  updateEntriesCount: () => void;
  updateRead: (id: number, isRead: boolean) => void;
  entriesUpdated: (entries: any[]) => void;
  feedsUpdated: (feeds: any[]) => void;
  entriesUpdateError: () => void;
  updateViewed: (ids: number[]) => void;
  updateFavorite: (id: number, isFavorite: boolean) => void;
  feedsDelete: (id: number) => void;
  feedsUpdate: (id: number, data: any) => void;
  feedsEditing: (isEditing: boolean) => void;
  feedsAdd: (feed: any) => void;
}

interface AppState {
  isSettingsVisible: boolean;
}

class App extends React.Component<AppProps, AppState> {
  state: AppState = {
    isSettingsVisible: false
  };

  private dataHelper: DataHelper;

  constructor(props: Readonly<AppProps>) {
    super(props);

    this.dataHelper = new DataHelper('http://localhost:8080/');

    if (localStorage.getItem('collpaseLong') === null) {
      localStorage.setItem('collpaseLong', String(false));
    }

    if (localStorage.getItem('keepDays') === null) {
      localStorage.setItem('keepDays', String(30));
    }

    this.onUpdate = this.onUpdate.bind(this);
    this.onShowUnviewed = this.onShowUnviewed.bind(this);
    this.onShowAll = this.onShowAll.bind(this);
    this.onShowRead = this.onShowRead.bind(this);
    this.onShowFavorites = this.onShowFavorites.bind(this);
    this.onUpdateViewed = this.onUpdateViewed.bind(this);
    this.onSetRead = this.onSetRead.bind(this);
    this.onSetFavorite = this.onSetFavorite.bind(this);
    this.onAddFeed = this.onAddFeed.bind(this);
    this.onChangeFeed = this.onChangeFeed.bind(this);
    this.onDeleteFeed = this.onDeleteFeed.bind(this);
    this.onToggleSettings = this.onToggleSettings.bind(this);
    this.hideSettings = this.hideSettings.bind(this);
  }

  componentDidMount() {
    this.dataHelper.getFeeds().then((feeds: any[]) => {
      console.log(feeds);
      this.props.feedsUpdated(feeds);
      this.dataHelper.getUnviewed().then((entries: any[]) => {
        console.log(entries);
        this.props.entriesUpdated(entries);
        this.props.updateUnviewedCount();
      });
    });

    this.dataHelper.clearEntries(localStorage.getItem('keepDays'));
  }

  render() {
    let styles = lightStyles;

    if (this.props.isDarkTheme) {
      styles = { ...lightStyles, ...darkStyles };
    }

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Menu onUpdate={this.onUpdate} onShowUnviewed={this.onShowUnviewed} onShowAll={this.onShowAll} onShowRead={this.onShowRead} onShowFavorites={this.onShowFavorites} />
            <SettingsButton isActive={this.state.isSettingsVisible} onClick={this.onToggleSettings} />

            <CSSTransition
              in={this.state.isSettingsVisible}
              timeout={200}
              classNames="fade"
              unmountOnExit
              mountOnEnter
            >
              <Settings isVisible={this.state.isSettingsVisible} />
            </CSSTransition>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.list}>
            <EntriesList onUpdateViewed={this.onUpdateViewed} onSetRead={this.onSetRead} onSetFavorite={this.onSetFavorite} />
          </div>
          <div className={styles.feeds}>
            <FeedsList onAddFeed={this.onAddFeed} onChangeFeed={this.onChangeFeed} onDeleteFeed={this.onDeleteFeed} />
          </div>
        </div>
      </div>
    );
  }

  onUpdate() {
    this.props.entriesUpdating();
    this.props.changeViewMode(0);

    this.dataHelper.update().then((entries: any[]) => {
      const unviewed = entries.filter((entry: any) => {
        return !entry.isViewed;
      });

      this.props.entriesUpdated(unviewed);
      this.props.updateUnviewedCount();
    }).catch((error: any) => {
      console.log(error);
      this.props.entriesUpdateError();
    });
  }

  onShowUnviewed() {
    this.props.changeViewMode(0);

    this.dataHelper.getUnviewed().then((entries: any[]) => {
      this.props.entriesUpdated(entries);
      this.props.updateUnviewedCount();
    });
  }

  onShowAll() {
    this.props.changeViewMode(1);

    this.dataHelper.allEntries().then((entries: any[]) => {
      this.props.entriesUpdated(entries);
      this.props.updateEntriesCount();
    });
  }

  onShowRead() {
    this.props.changeViewMode(2);

    this.dataHelper.readEntries().then((entries: any[]) => {
      this.props.entriesUpdated(entries);
      this.props.updateEntriesCount();
    });
  }

  onShowFavorites() {
    this.props.changeViewMode(3);

    this.dataHelper.getFavorites().then((entries: any[]) => {
      this.props.entriesUpdated(entries);
      this.props.updateEntriesCount();
    });
  }

  onUpdateViewed(ids: number[]) {
    this.dataHelper.setViewed(ids).then(() => {
      this.props.updateViewed(ids);
      this.props.updateUnviewedCount();
    });
  }

  onSetRead(id: number, isRead: boolean) {
    this.dataHelper.setRead(id, isRead).then(() => {
      this.props.updateRead(id, isRead);
    });
  }

  onSetFavorite(id: number, isFavorite: boolean) {
    this.dataHelper.setFavorite(id, isFavorite).then(() => {
      this.props.updateFavorite(id, isFavorite);
    });
  }

  onAddFeed(link: string) {
    this.dataHelper.addFeed(link).then((feed: any) => {
      console.log(feed);
      this.props.feedsAdd(feed);
      this.props.feedsEditing(false);
    }).catch((error: any) => {
      console.log(error);
    });
  }

  onChangeFeed(id: number, data: any) {
    this.dataHelper.updateFeed(id, data).then((data: { data: any; }) => {
      console.log(data);
      this.props.feedsUpdate(id, data.data);
      this.props.feedsEditing(false);
    });
  }

  onDeleteFeed(id: number) {
    this.dataHelper.deleteFeed(id).then((data: any) => {
      console.log(data);
      this.props.feedsDelete(id);
      this.props.feedsEditing(false);
    });
  }

  onToggleSettings() {
    const visible = !this.state.isSettingsVisible;

    if (visible) {
      document.addEventListener('click', this.hideSettings);
    } else {
      document.removeEventListener('click', this.hideSettings);
    }

    this.setState({
      isSettingsVisible: visible
    });
  }

  hideSettings() {
    if (this.state.isSettingsVisible) {
      this.onToggleSettings();
    }
  }
}

/* Redux */

const mapStateToProps = (state: { isDarkTheme: boolean }) => {
  return {
    isDarkTheme: state.isDarkTheme
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    feedsUpdated: (feeds: any[]) => dispatch(feedsUpdated(feeds)),
    entriesUpdating: () => dispatch(entriesUpdating()),
    entriesUpdated: (entries: any[]) => dispatch(entriesUpdated(entries)),
    updateUnviewedCount: () => dispatch(updateUnviewedCount()),
    updateEntriesCount: () => dispatch(updateEntriesCount()),
    updateViewed: (ids: number[]) => dispatch(updateViewed(ids)),
    updateFavorite: (id: number, isFavorite: boolean) => dispatch(updateFavorite(id, isFavorite)),
    feedsAdd: (feed: any) => dispatch(feedsAdd(feed)),
    feedsDelete: (id: number) => dispatch(feedsDelete(id)),
    updateRead: (id: number, isRead: boolean) => dispatch(updateRead(id, isRead)),
    changeViewMode: (mode: number) => dispatch(changeViewMode(mode)),
    feedsUpdate: (id: number, data: any) => dispatch(feedsUpdate(id, data)),
    feedsEditing: (isEditing: boolean) => dispatch(feedsEditing(isEditing)),
    entriesUpdateError: () => dispatch(entriesUpdateError())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App)
