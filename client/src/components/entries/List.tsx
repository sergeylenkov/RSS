import Data, { Entry } from '../../data';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { entriesUpdated, updateEntriesCount, updateFavorite, updateRead, updateUnviewedCount, updateViewed } from '../../store/actions';

import { Dispatch } from 'redux';
import EntryItem from './Entry';
import React from 'react';
import { connect } from 'react-redux';
import { debounce } from '../../utils';
import styles from './List.module.css';

interface MapStateToProps extends RouteComponentProps {
  entries: Entry[];
  isCollapseLong: boolean;
  isInitialized: boolean;
  entriesUpdated: (entries: Entry[]) => void;
  updateUnviewedCount: () => void;
  updateEntriesCount: () => void;
  updateViewed: (ids: number[]) => void;
  updateFavorite: (id: number, isFavorite: boolean) => void;
  updateRead: (id: number, isRead: boolean) => void;
}

interface EntriesListProps extends MapStateToProps {
}

interface EntriesListState {
}

class EntriesList extends React.Component<EntriesListProps, EntriesListState> {
  private viewedIds: { [key: number] : boolean } = {};

  public componentDidMount() {
    this.getEntries(this.props.location.pathname);
  }

  public componentDidUpdate(prevProps: EntriesListProps) {
    if (prevProps.isInitialized !== this.props.isInitialized || prevProps.location.pathname !== this.props.location.pathname) {
      this.getEntries(this.props.location.pathname);
    }
  }

  private OnViewDebonce = debounce(() => {
    const { updateViewed, updateUnviewedCount } = this.props;

    const ids = Object.keys(this.viewedIds).map(Number);

    Data.setViewed(ids).then(() => {
      updateViewed(ids);
      updateUnviewedCount();

      ids.forEach(id => {
        delete this.viewedIds[id];
      });
    });
  }, 1000, false);

  private onView = (id: number) => {
    this.viewedIds[id] = true;

    this.OnViewDebonce();
  };

  private onSetRead = (id: number, isRead: boolean) => {
    const { updateRead } = this.props;

    Data.setRead(id, isRead).then(() => {
      updateRead(id, isRead);
    });
  };

  private onSetFavorite = (id: number, isFavorite: boolean) => {
    const { updateFavorite } = this.props;

    Data.setFavorite(id, isFavorite).then(() => {
      updateFavorite(id, isFavorite);
    });
  };

  private getEntries(path: string) {
    const { isInitialized, entriesUpdated, updateUnviewedCount, updateEntriesCount } = this.props;

    if (!isInitialized) {
      return;
    }

    if (path === '/') {
      Data.getUnviewed().then((entries: Entry[]) => {
        entriesUpdated(entries);
        updateUnviewedCount();
      });
    }

    if (path === '/all') {
     Data.allEntries().then((entries: Entry[]) => {
        entriesUpdated(entries);
        updateEntriesCount();
      });
    }

    if (path === '/read') {
      Data.readEntries().then((entries: Entry[]) => {
        entriesUpdated(entries);
        updateEntriesCount();
      });
    }

    if (path === '/favorites') {
      Data.getFavorites().then((entries: Entry[]) => {
        entriesUpdated(entries);
        updateEntriesCount();
      });
    }
  }

  public render() {
    const { isCollapseLong, entries } = this.props;

    return (
      <div className={styles.container}>
        {
          entries.map((entry: Entry) => {
            return (
              <EntryItem
                key={entry.id}
                entry={entry}
                isCollapseLong={isCollapseLong}
                onView={this.onView}
                onSetRead={this.onSetRead}
                onSetFavorite={this.onSetFavorite} />
            )
          })
        }
      </div>
    );
  }
}

/* Redux */

const mapStateToProps = (state: MapStateToProps) => {
  return {
    entries: state.entries,
    isCollapseLong: state.isCollapseLong,
    isInitialized: state.isInitialized
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    entriesUpdated: (entries: Entry[]) => dispatch(entriesUpdated(entries)),
    updateUnviewedCount: () => dispatch(updateUnviewedCount()),
    updateEntriesCount: () => dispatch(updateEntriesCount()),
    updateViewed: (ids: number[]) => dispatch(updateViewed(ids)),
    updateRead: (id: number, isRead: boolean) => dispatch(updateRead(id, isRead)),
    updateFavorite: (id: number, isFavorite: boolean) => dispatch(updateFavorite(id, isFavorite)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EntriesList));
