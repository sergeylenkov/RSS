import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { entriesUpdated, updateEntriesCount, updateFavorite, updateRead, updateUnviewedCount, updateViewed } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import Data, { Entry } from '../../data';
import { debounce } from '../../utils';
import { State } from '../../store/reducers';
import EntryItem from './EntryItem';

import './EntriesList.scss';

function EntriesList(): JSX.Element {
  const { pathname } = useLocation();
  const isInitialized = useSelector<State, boolean>(state => state.isInitialized);
  const isCollapseLong = useSelector<State, boolean>(state => state.isCollapseLong);
  const entries = useSelector<State, Entry[]>(state => state.entries);
  const dispatch = useDispatch();

  const viewedIds = useRef<Set<number>>(new Set()).current;

  const OnViewDebonce = debounce(() => {
    Data.setViewed([...viewedIds]).then(() => {
      dispatch(updateViewed([...viewedIds]));
      dispatch(updateUnviewedCount());

      viewedIds.clear();
    });
  }, 1000, false);

  const onView = (id: number) => {
    viewedIds.add(id);
    OnViewDebonce();
  };

  const onSetRead = (id: number, isRead: boolean) => {
    Data.setRead(id, isRead).then(() => {
      dispatch(updateRead(id, isRead));
    });
  };

  const onSetFavorite = (id: number, isFavorite: boolean) => {
    Data.setFavorite(id, isFavorite).then(() => {
      dispatch(updateFavorite(id, isFavorite));
    });
  };

  const getEntries = (path: string) => {
    if (!isInitialized) {
      return;
    }

    if (path === '/') {
      Data.getUnviewed().then((response: Entry[]) => {
        dispatch(entriesUpdated(response));
        dispatch(updateUnviewedCount());
      });
    }

    if (path === '/all') {
      Data.allEntries().then((response: Entry[]) => {
        dispatch(entriesUpdated(response));
        dispatch(updateEntriesCount());
      });
    }

    if (path === '/read') {
      Data.readEntries().then((response: Entry[]) => {
        dispatch(entriesUpdated(response));
        dispatch(updateEntriesCount());
      });
    }

    if (path === '/favorites') {
      Data.getFavorites().then((response: Entry[]) => {
        dispatch( entriesUpdated(response));
        dispatch(updateEntriesCount());
      });
    }
  }

  useEffect(() => {
    getEntries(pathname);
  }, [pathname]);

  return (
    <div className='entries-list'>
      {
        entries.map((entry: Entry) => {
          return (
            <EntryItem
              key={entry.id}
              entry={entry}
              isCollapseLong={isCollapseLong}
              onView={onView}
              onSetRead={onSetRead}
              onSetFavorite={onSetFavorite} />
          )
        })
      }
    </div>
  );
}

export default EntriesList;
