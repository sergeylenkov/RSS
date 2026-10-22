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
import { useAppDispatch } from '../../store/hooks';
import { useSelector } from 'react-redux';
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
import { debounce, normalizePath } from '../../utils';
import { State } from '../../store/reducers';
import { EntryItemRef } from './EntryItem';

import './EntriesList.scss';

/** Tabs the list knows how to load. Any other path shows nothing. */
const TAB_PATHS = ['/', '/all', '/read', '/favorites'];

export function EntriesList(): React.JSX.Element {
  const { pathname } = useLocation();
  // Normalising makes the comparison below tolerant to a trailing slash or a
  // percent-encoded character, so `/all/` and `/%61ll` still open the "all"
  // tab instead of silently falling through every check.
  const path = normalizePath(pathname);
  const isInitialized = useSelector<State, boolean>(
    (state) => state.isInitialized
  );
  const isCollapseLong = useSelector<State, boolean>(
    (state) => state.isCollapseLong
  );
  const entries = useSelector<State, Entry[]>((state) => state.entries);
  const dispatch = useAppDispatch();
  const entryItems = useRef<Map<number, HTMLDivElement>>(new Map()).current;
  const viewedIds = useRef<Set<number>>(new Set()).current;
  const observer = useRef<IntersectionObserver | null>(null);

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
    if (!TAB_PATHS.includes(path)) {
      // Unknown route: drop the entries of the previous tab instead of
      // rendering them as if they belonged to the current one.
      dispatch(entriesUpdated([]));
      return;
    }

    getEntries(path);
    // `isInitialized` is a dependency on purpose: on the very first render the
    // feeds are usually not loaded yet, `getEntries` bails out early and the
    // list would stay empty until the user switched tabs.
  }, [path, isInitialized]);

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
