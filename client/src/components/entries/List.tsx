import React from 'react';
import Entry from './Entry';
import { debounce } from '../../Utils';
import { connect } from 'react-redux';

import styles from './List.module.css';

interface MapStateToProps {
  entries: any[];
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

  private onView = (id: number) => {
    this.viewedIds.push(id);
    this.updateViewed();
  };

  public render() {
    const { onSetFavorite, onSetRead, entries, isCollapseLong } = this.props;

    return (
      <div className={styles.container}>
        {
          entries.map((entry) => {
            return (
              <Entry
                key={entry.id}
                entry={entry}
                isCollapseLong={isCollapseLong}
                onView={this.onView}
                onSetRead={onSetRead}
                onSetFavorite={onSetFavorite} />
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
    isCollapseLong: state.isCollapseLong
  };
};

export default connect(mapStateToProps)(ConnectedEntriesList);
