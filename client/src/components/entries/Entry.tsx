import React, {createRef} from 'react';
import { connect } from 'react-redux';
import { FavoriteSelectedIcon, FavoriteIcon, ReadIcon } from '../Icons';
import { Entry } from "../../data/data";

import lightStyles from './Entry.module.css';
import darkStyles from './Entry.dark.module.css';

interface MapStateToProps {
  isDarkTheme: boolean;
}

interface EntryProps extends MapStateToProps {
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

  constructor(props: Readonly<EntryProps>) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);
    this.handleMove = this.handleMove.bind(this);
  }

  public componentDidMount() {
    if (!this.props.entry.isViewed) {
      window.addEventListener('scroll', this.handleScroll);
      window.addEventListener('mousemove', this.handleMove);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('mousemove', this.handleMove);
  }

  private removeSelfLinks(description: string, link: string) {
    let el = document.createElement('div');
    el.innerHTML = description;

    let items = Array.from(el.getElementsByTagName('a'));

    let links = items.filter((item) => {
      let href = item.getAttribute('href');

      return !!(href && href.indexOf(link) !== -1);
    });

    for (let i = 0; i < links.length; i++) {
      links[i].remove();
    }

    return el.innerHTML;
  }

  static isLong(description: string) {
    let el = document.createElement('div');
    el.innerHTML = description;

    if (el.getElementsByTagName('img').length > 3) {
      return true;
    }

    return el.innerText.length > 1500;
  }

  private handleScroll() {
    const { entry, onView } = this.props;

    if (!entry.isViewed) {
      const rect = this.itemElement!.getBoundingClientRect();
      const height = window.innerHeight / 2;

      let isViewed = false;
      let scrollEnd = false;

      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        scrollEnd = true;
      }

      if (scrollEnd && rect.top > 0) {
        isViewed = true;
      } else if (rect.top < height) {
        isViewed = true;
      }

      if (isViewed) {
        onView(entry.id);
      }
    }
  }

  private handleMove() {
    if (!this.props.entry.isViewed) {
      const rect = this.itemElement!.getBoundingClientRect();
      const height = rect.top + rect.height;

      if (height < window.innerHeight) {
        this.props.onView(this.props.entry.id);
      }

      window.removeEventListener('mousemove', this.handleMove);
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

  public render() {
    const { isDarkTheme, entry, isCollapseLong } = this.props;
    const { isExpanded } = this.state;

    let styles = lightStyles;

    if (isDarkTheme) {
      styles = {...lightStyles, ...darkStyles};
    }

    const description = this.removeSelfLinks(entry.description, entry.link);

    let readIcon = null;

    if (entry.isRead) {
      readIcon = <div className={styles.infoItem} onClick={this.onUnread}><div className={styles.infoIcon}><ReadIcon /></div></div>;
    }

    let className = styles.container;
    let expandButton = null;

    if (isCollapseLong && !isExpanded && EntryItem.isLong(description)) {
      className += ` ${styles.collapsed}`;
      expandButton = <button className={styles.expandButton} onClick={this.onExpand} />
    }

    return (
      <div className={className} ref={this.itemRefCallback}>
        <div
          className={styles.title}
          ref={this.titleRefCallback}>
          <a href={entry.link}>{entry.title}</a>
        </div>
        <div className={styles.feed}>
          <div className={styles.feedIcon} style={{ backgroundImage: `url(${entry.feed.icon})` }} />
          <div className={styles.feedTitle}>{entry.feed.title}</div>
        </div>
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
        {expandButton}
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon} onClick={this.onSetFavorite}>
              {entry.isFavorite ? <FavoriteSelectedIcon /> : <FavoriteIcon /> }
            </div>
          </div>
          {readIcon}
        </div>
      </div>
    );
  }
}

/* Redux */

const mapStateToProps = (state: MapStateToProps) => {
  return {
    isDarkTheme: state.isDarkTheme
  };
};

export default connect(mapStateToProps)(EntryItem);
