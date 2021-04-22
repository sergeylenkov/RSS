import { config } from '../constants';

export interface SetReadResponse {
  id: number;
  isRead: boolean;
}

export interface SetFavoriteResponse {
  id: number;
  isFavorite: boolean;
}

export interface SetViewedResponse {
  ids: number[];
  isViewed: boolean;
}

export interface ClearEntriesResponse {
  days: number;
}

export interface UpdateFeedResponse {
  id: number;
  data: Feed;
}

export interface DeleteFeedResponse {
  id: number;
  isDeleted: boolean;
}

export interface Feed {
  id: number;
  title: string;
  link: string;
  image: string;
  icon: string;
  count: number;
}

export interface Entry {
  id: number;
  feedId: number;
  feed: Feed;
  title: string;
  description: string;
  link: string;
  isViewed: boolean;
  isFavorite: boolean;
  isRead: boolean;
}

class Data {
  private _url: string;

  constructor(url: string) {
    this._url = url;
  }

  update() {
    return new Promise<Entry[]>((resolve, reject) => {
      fetch(`${this._url}feeds/update`).then((response) => {
        return response.json();
      }).then((data) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      })
    });
  }

  getFeeds() {
    return new Promise<Feed[]>((resolve) => {
      fetch(`${this._url}feeds`).then((response) => {
        return response.json();
      }).then((feeds: Feed[]) => {
        feeds.forEach((feed: Feed) => {
          const a = document.createElement('a');
          a.href = feed.link;

          if (feed.image && feed.image.length > 0) {
            feed.icon = feed.image;
          } else {
            feed.icon = `${a.protocol}//${a.hostname}/favicon.ico`;
          }
        });

        resolve(feeds);
      });
    });
  }

  allEntries() {
    return new Promise<Entry[]>((resolve) => {
      fetch(`${this._url}entries`).then((response) => {
        return response.json();
      }).then((entries: Entry[]) => {
        resolve(entries);
      });
    });
  }

  readEntries() {
    return new Promise<Entry[]>((resolve) => {
      fetch(`${this._url}entries/read`).then((response) => {
        return response.json();
      }).then((entries: Entry[]) => {
        resolve(entries);
      });
    });
  }

  getFavorites() {
    return new Promise<Entry[]>((resolve) => {
      fetch(`${this._url}entries/favorites`).then((response) => {
        return response.json();
      }).then((entries: Entry[]) => {
        resolve(entries);
      });
    });
  }

  getUnviewed() {
    return new Promise<Entry[]>((resolve) => {
      fetch(`${this._url}entries/unviewed`).then((response) => {
        return response.json();
      }).then((entries: Entry[]) => {
        resolve(entries);
      });
    });
  }

  setViewed(ids: number[]) {
    return new Promise<SetViewedResponse>((resolve) => {
      fetch(`${this._url}entries/view`, {
        method: 'POST',
        body: JSON.stringify({ ids: ids }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((response: SetViewedResponse) => {
        resolve(response);
      });
    });
  }

  setRead(id: number, isRead: boolean) {
    return new Promise<SetReadResponse>((resolve) => {
      const method = isRead ? 'PUT' : 'DELETE';

      fetch(`${this._url}entries/${id}/read`, {
        method: method
      }).then((response) => {
        return response.json();
      }).then((response: SetReadResponse) => {
        resolve(response);
      });
    });
  }

  setFavorite(id: number, isFavorite: boolean) {
    return new Promise<SetFavoriteResponse>((resolve) => {
      const method = isFavorite ? 'PUT' : 'DELETE';

      fetch(`${this._url}entries/${id}/favorite`, {
        method: method
      }).then((response) => {
        return response.json();
      }).then((response: SetFavoriteResponse) => {
        resolve(response);
      });
    });
  }

  addFeed(link: string) {
    return new Promise<Feed>((resolve) => {
      fetch(`${this._url}feeds`, {
        method: 'POST',
        body: JSON.stringify({ link: link }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((feed: Feed) => {
        resolve(feed);
      });
    });
  }

  updateFeed(id: number, data: string) {
    return new Promise<UpdateFeedResponse>((resolve) => {
      fetch(`${this._url}feeds/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((response: UpdateFeedResponse) => {
        resolve(response);
      });
    });
  }

  deleteFeed(id: number) {
    return new Promise<DeleteFeedResponse>((resolve) => {
      fetch(`${this._url}feeds/${id}`, {
        method: 'DELETE'
      }).then((response) => {
        return response.json();
      }).then((response: DeleteFeedResponse) => {
        resolve(response);
      });
    });
  }

  clearEntries(days: number) {
    return new Promise<ClearEntriesResponse>((resolve) => {
      fetch(`${this._url}entries/clear/${days}`).then((response) => {
        return response.json();
      }).then((response: ClearEntriesResponse) => {
        resolve(response);
      });
    });
  }
}

export default new Data(config.urls.api);