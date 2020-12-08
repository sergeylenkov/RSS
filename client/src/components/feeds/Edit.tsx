import React from 'react';
import { connect } from 'react-redux';
import { CheckmarkIcon, CloseIcon, AddIcon, EditIcon } from '../Icons';
import { combineStyles } from '../../utils/styles';

import lightStyles from './Edit.module.css';
import gridStyles from './Edit.grid.module.css';
import darkStyles from './Edit.dark.module.css';

interface MapStateToProps {
  isDarkTheme: boolean;
  isGrid: boolean;
}

interface FeedEditProps extends MapStateToProps {
  isEditing: boolean;
  isDisabled?: boolean;
  isScrolled?: boolean;
  onEdit: () => void;
  onAdd: (link: string) => void;
}

interface FeedEditState {
  isFormVisible: boolean;
}

class FeedEdit extends React.Component<FeedEditProps, FeedEditState> {
  public state: FeedEditState = {
    isFormVisible: false
  };

  private linkFieldRef = React.createRef<HTMLInputElement>();

  private onAdd= () => {
    const { onAdd } = this.props;
    const value = this.linkFieldRef.current!.value;

    if (value.length > 0) {
      onAdd(value);
    }
  };

  private onShow = () => {
    this.setState({
      isFormVisible: true
    });
  };

  private onClose = () => {
    this.setState({
      isFormVisible: false
    });
  };

  public render() {
    const { isDarkTheme, isGrid, isDisabled, isScrolled, isEditing, onEdit } = this.props;
    const { isFormVisible } = this.state;

    const styles = combineStyles(lightStyles, (isGrid && gridStyles), (isDarkTheme && darkStyles));

    let className = styles.container;

    if (isDisabled) {
      className += ` ${styles.disabled}`;
    }

    if (isScrolled) {
      className += ` ${styles.scrolled}`;
    }

    if (isFormVisible) {
      return (
        <div className={className}>
          <div className={styles.form}>
            <input className={styles.linkField} placeholder="ссылка на канал" type="text" ref={this.linkFieldRef} />
            <button className={styles.formButton} onClick={this.onAdd}><div className={styles.icon}><CheckmarkIcon /></div></button>
            <button className={styles.formButton} onClick={this.onClose}><div className={styles.icon}><CloseIcon /></div></button>
          </div>
        </div>
      );
    } else {
      let iconClassName = styles.icon;

      if (isEditing) {
        iconClassName += ` ${styles.editing}`;
      }

      return (
        <div className={className}>
          <button className={styles.button} onClick={this.onShow}><div className={styles.icon}><AddIcon /></div></button>
          <button className={styles.button} onClick={onEdit}><div className={iconClassName}><EditIcon /></div></button>
        </div>
      );
    }
  }
}

/* Redux */

const mapStateToProps = (state: MapStateToProps) => {
  return {
    isDarkTheme: state.isDarkTheme,
    isGrid: state.isGrid
  };
};

export default connect(mapStateToProps)(FeedEdit);
