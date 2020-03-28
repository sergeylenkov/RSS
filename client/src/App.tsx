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

interface MapStateToProps {
  isDarkTheme: boolean;
}

interface AppProps extends MapStateToProps {
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

    if (localStorage.getItem('keepDays') === null) {
      localStorage.setItem('keepDays', String(30));
    }

    this.hideSettings = this.hideSettings.bind(this);
  }

  public componentDidMount() {
    const { feedsUpdated, entriesUpdated, updateUnviewedCount } = this.props;

    this.dataHelper.getFeeds().then((feeds: any[]) => {
      console.log(feeds);
      feedsUpdated(feeds);
      this.dataHelper.getUnviewed().then((entries: any[]) => {
        console.log(entries);
        entriesUpdated(entries);
        updateUnviewedCount();
      });
    });

    this.dataHelper.clearEntries(localStorage.getItem('keepDays'));
  }

  public render() {
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

  private onUpdate() {
    const { changeViewMode, entriesUpdated, updateUnviewedCount, entriesUpdateError } = this.props;

    entriesUpdating();
    changeViewMode(0);

    this.dataHelper.update().then((entries: any[]) => {
      const unviewed = entries.filter((entry: any) => {
        return !entry.isViewed;
      });

      entriesUpdated(unviewed);
      updateUnviewedCount();
    }).catch((error: any) => {
      console.log(error);
      entriesUpdateError();
    });
  }

  private onShowUnviewed() {
    const { changeViewMode, entriesUpdated, updateUnviewedCount } = this.props;

    changeViewMode(0);

    this.dataHelper.getUnviewed().then((entries: any[]) => {
      entriesUpdated(entries);
      updateUnviewedCount();
    });
  }

  private onShowAll() {
    const { changeViewMode, entriesUpdated, updateEntriesCount } = this.props;

    changeViewMode(1);

    this.dataHelper.allEntries().then((entries: any[]) => {
      entriesUpdated(entries);
      updateEntriesCount();
    });
  }

  private onShowRead() {
    const { changeViewMode, entriesUpdated, updateEntriesCount } = this.props;

    changeViewMode(2);

    this.dataHelper.readEntries().then((entries: any[]) => {
      entriesUpdated(entries);
      updateEntriesCount();
    });
  }

  private onShowFavorites() {
    const { changeViewMode, entriesUpdated, updateEntriesCount } = this.props;

    changeViewMode(3);

    this.dataHelper.getFavorites().then((entries: any[]) => {
      entriesUpdated(entries);
      updateEntriesCount();
    });
  }

  private onUpdateViewed(ids: number[]) {
    const { updateViewed, updateUnviewedCount } = this.props;

    this.dataHelper.setViewed(ids).then(() => {
      updateViewed(ids);
      updateUnviewedCount();
    });
  }

  private onSetRead(id: number, isRead: boolean) {
    const { updateRead } = this.props;

    this.dataHelper.setRead(id, isRead).then(() => {
      updateRead(id, isRead);
    });
  }

  private onSetFavorite(id: number, isFavorite: boolean) {
    const { updateFavorite } = this.props;

    this.dataHelper.setFavorite(id, isFavorite).then(() => {
      updateFavorite(id, isFavorite);
    });
  }

  private onAddFeed(link: string) {
    const { feedsAdd, feedsEditing } = this.props;

    this.dataHelper.addFeed(link).then((feed: any) => {
      feedsAdd(feed);
      feedsEditing(false);
    }).catch((error: any) => {
      console.log(error);
    });
  }

  private onChangeFeed(id: number, data: any) {
    const { feedsUpdate, feedsEditing } = this.props;

    this.dataHelper.updateFeed(id, data).then((data: { data: any; }) => {
      feedsUpdate(id, data.data);
      feedsEditing(false);
    });
  }

  private onDeleteFeed(id: number) {
    const { feedsDelete, feedsEditing } = this.props;

    this.dataHelper.deleteFeed(id).then((data: any) => {
      feedsDelete(id);
      feedsEditing(false);
    });
  }

  private onToggleSettings() {
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

  private hideSettings() {
    if (this.state.isSettingsVisible) {
      this.onToggleSettings();
    }
  }
}

/* Redux */

const mapStateToProps = (state: MapStateToProps) => {
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
