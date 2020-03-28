import React from 'react';
import { Entry } from './Entry';
import { debounce } from '../../Utils';
import { connect } from 'react-redux';

import styles from './List.module.css';

interface MapStateToProps {
  entries: any[];
  viewMode: number;
  isCollapseLong: boolean;
}

interface ConnectedEntriesListProps extends MapStateToProps {
  onUpdateViewed: (ids: number[]) => void;
  onSetRead: (id: number, isRead: boolean) => void;
  onSetFavorite: (id: number, isRead: boolean) => void;
}

class ConnectedEntriesList extends React.Component<ConnectedEntriesListProps> {
  private viewedIds: number[] = [];
  private updateViewed = debounce(() => {
    this.props.onUpdateViewed(this.viewedIds);
    this.viewedIds = [];
  }, 1000, false);

  public render() {
    const { onSetFavorite, onSetRead, viewMode, entries, isCollapseLong } = this.props;

    return (
      <div className={styles.container}>
        {
          entries.map((entry) => {
            return (
              <Entry
                key={entry.id}
                entry={entry}
                isCollapseLong={isCollapseLong}
                viewMode={viewMode}
                onView={this.onView}
                onSetRead={onSetRead}
                onSetFavorite={onSetFavorite} />
            )
          })
        }
      </div>
    );
  }

  private onView(id: number) {
    this.viewedIds.push(id);
    this.updateViewed();
  }
}

/* Redux */

const mapStateToProps = (state: MapStateToProps) => {
  return {
    entries: state.entries,
    viewMode: state.viewMode,
    isCollapseLong: state.isCollapseLong
  };
};

export const EntriesList = connect(mapStateToProps)(ConnectedEntriesList);
