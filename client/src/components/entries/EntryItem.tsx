import { FavoriteIcon, FavoriteSelectedIcon, ReadIcon } from '../Icons';

import { Entry } from '../../data';
import React from 'react';
import { debounce } from '../../utils';

import './EntryItem.scss';

interface EntryProps {
  entry: Entry;
  isCollapseLong: boolean;
  onView: (id: number) => void;
  onSetRead: (id: number, isRead: boolean) => void;
  onSetFavorite: (id: number, isRead: boolean) => void;
}

interface EntryState {
  isExpanded: boolean;
}

class EntryItem extends React.Component<EntryProps, EntryState> {
  public state: EntryState = {
    isExpanded: false
  };

  private itemElement: HTMLDivElement | null = null;
  private titleElement: HTMLDivElement | null = null;

  private itemRefCallback = (element: HTMLDivElement) => {
    if (element) this.itemElement = element;
  };

  private titleRefCallback = (element: HTMLDivElement) => {
    if (element) {
      this.titleElement = element;
      this.titleElement.addEventListener('mouseup', this.onRead);
    }
  };

  public componentDidMount(): void {
    if (!this.props.entry.isViewed) {
      window.addEventListener('scroll', this.onScrollDebounce);
      window.addEventListener('mousemove', this.onMouseMove);
    }
  }

  public componentWillUnmount(): void {
    window.removeEventListener('scroll', this.onScrollDebounce);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  private onScrollDebounce = debounce(() => {
    this.onScroll();
  }, 500, false)

  private removeSelfLinks(description: string, link: string) {
    const el = document.createElement('div');
    el.innerHTML = description;

    const items = Array.from(el.getElementsByTagName('a'));

    const links = items.filter((item) => {
      const href = item.getAttribute('href');

      return !!(href && href.indexOf(link) !== -1);
    });

    links.forEach(link => link.remove());

    return el.innerHTML;
  }

  static isLong(description: string): boolean {
    const el = document.createElement('div');
    el.innerHTML = description;

    if (el.getElementsByTagName('img').length > 3) {
      return true;
    }

    return el.innerText.length > 1500;
  }

  private onScroll() {
    const { entry, onView } = this.props;

    if (!entry.isViewed && this.itemElement) {
      const rect = this.itemElement.getBoundingClientRect();
      const height = window.innerHeight / 2;

      let isViewed = false;
      let scrollEnd = false;

      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        scrollEnd = true;
      }

      if ((scrollEnd && rect.top > 0) || (rect.top < height)) {
        isViewed = true;
      }

      if (isViewed) {
        onView(entry.id);
      }
    }
  }

  private onMouseMove = () => {
    const { entry, onView } = this.props;

    if (!entry.isViewed && this.itemElement) {
      const rect = this.itemElement.getBoundingClientRect();
      const height = rect.top + rect.height;

      if (height < window.innerHeight) {
        onView(entry.id);
      }

      window.removeEventListener('mousemove', this.onMouseMove);
    }
  }

  private onExpand = () => {
    this.setState({
      isExpanded: true
    });

    this.onRead();
  };

  private onRead = () => {
    const { onSetRead, entry } = this.props;

    if (!entry.isRead) {
      onSetRead(entry.id, true);
    }
  };

  private onUnread = () => {
    const { onSetRead, entry } = this.props;
    onSetRead(entry.id, false);
  };

  private onSetFavorite = () => {
    const { onSetFavorite, entry } = this.props;
    onSetFavorite(entry.id, !entry.isFavorite);
  };

  public render(): JSX.Element {
    const { entry, isCollapseLong } = this.props;
    const { isExpanded } = this.state;

    const description = this.removeSelfLinks(entry.description, entry.link);

    let readIcon = null;

    if (entry.isRead) {
      readIcon = <div className='entry__info__item' onClick={this.onUnread}><div className='entry__info__icon'><ReadIcon /></div></div>;
    }

    let className = 'entry__container';
    let expandButton = null;

    if (isCollapseLong && !isExpanded && EntryItem.isLong(description)) {
      className += ' collapsed';
      expandButton = <button className='entry__expandButton' onClick={this.onExpand} />
    }

    return (
      <div className={className} ref={this.itemRefCallback}>
        <div
          className='entry__title'
          ref={this.titleRefCallback}>
          <a href={entry.link}>{entry.title}</a>
        </div>
        <div className='entry__feed'>
          <div className='entry__feed__icon' style={{ backgroundImage: `url(${entry.feed.icon})` }} />
          <div className='entry__feed__title'>{entry.feed.title}</div>
        </div>
        <div className='entry__description' dangerouslySetInnerHTML={{ __html: description }} />
        {expandButton}
        <div className='entry__info'>
          <div className='entry__info__item'>
            <div className='entry__info__icon' onClick={this.onSetFavorite}>
              {entry.isFavorite ? <FavoriteSelectedIcon /> : <FavoriteIcon /> }
            </div>
          </div>
          {readIcon}
        </div>
      </div>
    );
  }
}

export default EntryItem;
