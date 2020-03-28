import MenuButton from './MenuButton';
import React from 'react';
import { ReloadIcon } from '../Icons';
import { connect } from 'react-redux';
import darkStyles from './ReloadButton.dark.module.css';
import lightStyles from './ReloadButton.module.css';

interface MapStateToProps {
  isDarkTheme: boolean;
}

interface ReloadButtonProps extends MapStateToProps {
  isSelected: boolean;
  isActive: boolean;
  isError: boolean;
  count: number;
  onClick: () => void;
  onUpdate: () => void;
}

class ReloadButton extends React.Component<ReloadButtonProps> {
  private onClick = () => {
    const { isSelected, onClick } = this.props;

    if (!isSelected) {
      onClick();
    }
  }

  public render() {
    const { isDarkTheme, onUpdate, isSelected, count, isActive, isError } = this.props;
    let styles = lightStyles;

    if (isDarkTheme) {
      styles = { ...lightStyles, ...darkStyles };
    }

    return (
      <div className={`${styles.container} ${isActive ? styles.active : ''} ${isError ? styles.error : ''}`}>
        <button className={styles.icon} onClick={onUpdate}><ReloadIcon /></button>
        <MenuButton title={'Свежее'} isSelected={isSelected} count={count} onClick={this.onClick} />
      </div>
    );
  }
}

/* Redux */

const mapStateToProps = (state: MapStateToProps) => {
  return {
    isDarkTheme: state.isDarkTheme,
  };
};


export default connect(mapStateToProps)(ReloadButton);
