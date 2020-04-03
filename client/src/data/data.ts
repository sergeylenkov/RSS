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
  data: any;
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

export class Data {
  private url = '';
  private feeds: Feed[] = [];
  private feedsDict: { [key: string]: Feed } = {};

  constructor(url: string) {
    this.url = url;
  }

  public update() {
    return new Promise<any[]>((resolve, reject) => {
      fetch(`${this.url}feeds/update`).then((response) => {
        return response.json();
      }).then((data) => {
        this.updateFeedsInEntries(data);
        resolve(data);
      }).catch((error) => {
        reject(error);
      })
    });
  }

  public getFeeds() {
    return new Promise<Feed[]>((resolve) => {
      fetch(`${this.url}feeds`).then((response) => {
        return response.json();
      }).then((data: Feed[]) => {
        this.feeds = data;

        this.feeds.forEach((feed: Feed) => {
          const a = document.createElement('a');
          a.href = feed.link;

          if (feed.image && feed.image.length > 0) {
            feed.icon = feed.image;
          } else {
            feed.icon = `${a.protocol}//${a.hostname}/favicon.ico`;
          }

          this.feedsDict[feed.id] = feed;
        });

        resolve(this.feeds);
      });
    });
  }

  public allEntries() {
    return new Promise<Entry[]>((resolve) => {
      fetch(`${this.url}entries`).then((response) => {
        return response.json();
      }).then((data: Entry[]) => {
        this.updateFeedsInEntries(data);
        resolve(data);
      });
    });
  }

  public readEntries() {
    return new Promise<Entry[]>((resolve) => {
      fetch(`${this.url}entries/read`).then((response) => {
        return response.json();
      }).then((data: Entry[]) => {
        this.updateFeedsInEntries(data);
        resolve(data);
      });
    });
  }

  public getFavorites() {
    return new Promise<Entry[]>((resolve) => {
      fetch(`${this.url}entries/favorites`).then((response) => {
        return response.json();
      }).then((data: Entry[]) => {
        this.updateFeedsInEntries(data);
        resolve(data);
      });
    });
  }

  public getUnviewed() {
    return new Promise<Entry[]>((resolve) => {
      fetch(`${this.url}entries/unviewed`).then((response) => {
        return response.json();
      }).then((data: Entry[]) => {
        this.updateFeedsInEntries(data);
        resolve(data);
      });
    });
  }

  public setViewed(ids: number[]) {
    return new Promise<SetViewedResponse>((resolve) => {
      fetch(`${this.url}entries/view`, {
        method: 'POST',
        body: JSON.stringify({ ids: ids }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((data) => {
        resolve(data);
      });
    });
  }

  public setRead(id: number, isRead: boolean) {
    return new Promise<SetReadResponse>((resolve) => {
      const method = isRead ? 'PUT' : 'DELETE';

      fetch(`${this.url}entries/${id}/read`, {
        method: method
      }).then((response) => {
        return response.json();
      }).then((data) => {
        resolve(data);
      });
    });
  }

  public setFavorite(id: number, isFavorite: boolean) {
    return new Promise<SetFavoriteResponse>((resolve) => {
      const method = isFavorite ? 'PUT' : 'DELETE';

      fetch(`${this.url}entries/${id}/favorite`, {
        method: method
      }).then((response) => {
        return response.json();
      }).then((data) => {
        resolve(data);
      });
    });
  }

  public addFeed(link: string) {
    return new Promise((resolve) => {
      fetch(`${this.url}feeds`, {
        method: 'POST',
        body: JSON.stringify({ link: link }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((data) => {
        resolve(data);
      });
    });
  }

  public updateFeed(id: number, data: any) {
    return new Promise<UpdateFeedResponse>((resolve) => {
      fetch(`${this.url}feeds/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((data) => {
        resolve(data);
      });
    });
  }

  public deleteFeed(id: number) {
    return new Promise((resolve) => {
      fetch(`${this.url}feeds/${id}`, {
        method: 'DELETE'
      }).then((response) => {
        return response.json();
      }).then((data) => {
        resolve(data);
      });
    });
  }

  public clearEntries(days: number) {
    return new Promise<ClearEntriesResponse>((resolve) => {
      fetch(`${this.url}entries/clear/${days}`).then((response) => {
        return response.json();
      }).then((data) => {
        resolve(data);
      });
    });
  }

  public getFeedById(id: number) : Feed {
    return this.feedsDict[id];
  }

  public updateFeedsInEntries(entries: Entry[]) {
    entries.forEach(entry => {
      entry.feed = this.getFeedById(entry.feedId);
    });
  }
}
