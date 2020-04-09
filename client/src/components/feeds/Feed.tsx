import { CheckmarkIcon, TrashIcon } from '../Icons';

import React from 'react';
import { connect } from 'react-redux';
import darkStyles from './Feed.dark.module.css';
import lightStyles from './Feed.module.css';

interface MapStateToProps {
  isDarkTheme: boolean;
}

interface FeedProps extends MapStateToProps {
  id: number;
  icon: string;
  title: string;
  count: number;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onChange: (id: number, title: string) => void;
}

class FeedItem extends React.Component<FeedProps> {
  private titleFieldRef = React.createRef<HTMLInputElement>();

  onSelect = () => {
    const { id, onSelect } = this.props;
    onSelect(id);
  };

  onDelete = () => {
    const { id, onDelete } = this.props;
    onDelete(id);
  };

  onChange = () => {
    const { id, onChange } = this.props;
    const value = this.titleFieldRef.current!.value;

    onChange(id, value);
  }

  renderViewMode() {
    const { icon, title, count, isDarkTheme, isSelected } = this.props;

    let styles = lightStyles;

    if (isDarkTheme) {
      styles = { ...lightStyles, ...darkStyles };
    }

    return (
      <button className={`${styles.button} ${isSelected ? styles.selected : ''}`} onClick={this.onSelect}>
        <div className={styles.icon} style={{ backgroundImage: `url(${icon})` }} />
        <div className={styles.label}>{title}</div>
        <div className={styles.counter}>{count}</div>
      </button>
    )
  }

  renderEditMode() {
    const { icon, title, isDarkTheme } = this.props;

    let styles = lightStyles;

    if (isDarkTheme) {
      styles = { ...lightStyles, ...darkStyles };
    }

    return (
      <div className={styles.editPanel}>
        <div className={styles.icon} style={{ backgroundImage: `url(${icon})` }} />
        <input className={styles.titleField} defaultValue={title} type="text" ref={this.titleFieldRef} />
        <button className={styles.editButton} onClick={this.onChange}><div className={styles.editButtonIcon}><CheckmarkIcon /></div></button>
        <button className={styles.editButton} onClick={this.onDelete}><div className={styles.editButtonIcon}><TrashIcon /></div></button>
      </div>
    )
  }

  public render() {
    const { isDarkTheme, isEditing } = this.props;

    let styles =lightStyles;

    if (isDarkTheme) {
      styles = { ...lightStyles, ...darkStyles };
    }

    return (
      <div className={styles.container}>
        {
          isEditing ? this.renderEditMode() : this.renderViewMode()
        }
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

export default connect(mapStateToProps)(FeedItem);
