import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  entriesUpdated,
  updateEntriesCount,
  updateFavorite,
  updateRead,
  updateUnviewedCount,
  updateViewed,
} from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import {
  allEntries,
  Entry,
  getFavorites,
  getUnviewed,
  readEntries,
  setFavorite,
  setRead,
  setViewed,
} from '../../data';
import { debounce } from '../../utils';
import { State } from '../../store/reducers';
import { EntryItemRef } from './EntryItem';

import './EntriesList.scss';

export function EntriesList(): JSX.Element {
  const { pathname } = useLocation();
  const isInitialized = useSelector<State, boolean>(
    (state) => state.isInitialized
  );
  const isCollapseLong = useSelector<State, boolean>(
    (state) => state.isCollapseLong
  );
  const entries = useSelector<State, Entry[]>((state) => state.entries);
  const dispatch = useDispatch();
  const entryItems = useRef<Map<number, HTMLDivElement>>(new Map()).current;
  const viewedIds = useRef<Set<number>>(new Set()).current;
  const observer = useRef<IntersectionObserver>();

  const OnViewDebonce = debounce(() => {
    setViewed([...viewedIds]).then(() => {
      dispatch(updateViewed([...viewedIds]));
      dispatch(updateUnviewedCount());

      viewedIds.clear();
    });
  }, 1000);

  const onView = (id: number) => {
    viewedIds.add(id);
    OnViewDebonce();
  };

  const onSetRead = (id: number, isRead: boolean) => {
    setRead(id, isRead).then(() => {
      dispatch(updateRead(id, isRead));
    });
  };

  const onSetFavorite = (id: number, isFavorite: boolean) => {
    setFavorite(id, isFavorite).then(() => {
      dispatch(updateFavorite(id, isFavorite));
    });
  };

  const getEntries = (path: string) => {
    if (!isInitialized) {
      return;
    }

    if (path === '/') {
      getUnviewed().then((response: Entry[]) => {
        dispatch(entriesUpdated(response));
        dispatch(updateUnviewedCount());
      });
    }

    if (path === '/all') {
      allEntries().then((response: Entry[]) => {
        dispatch(entriesUpdated(response));
        dispatch(updateEntriesCount());
      });
    }

    if (path === '/read') {
      readEntries().then((response: Entry[]) => {
        dispatch(entriesUpdated(response));
        dispatch(updateEntriesCount());
      });
    }

    if (path === '/favorites') {
      getFavorites().then((response: Entry[]) => {
        dispatch(entriesUpdated(response));
        dispatch(updateEntriesCount());
      });
    }
  };

  useEffect(() => {
    getEntries(pathname);
  }, [pathname]);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (elements) => {
        elements.forEach((el) => {
          if (el.isIntersecting) {
            for (const [key, value] of entryItems) {
              if (value === el.target) {
                onView(key);
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="entries-list">
      {entries.map((entry: Entry) => {
        return (
          <EntryItemRef
            ref={(ref) => {
              if (ref && observer.current && !entry.isViewed) {
                entryItems.set(entry.id, ref);
                observer.current.observe(ref);
              }
            }}
            key={entry.id}
            entry={entry}
            isCollapseLong={isCollapseLong}
            onSetRead={onSetRead}
            onSetFavorite={onSetFavorite}
          />
        );
      })}
    </div>
  );
}
