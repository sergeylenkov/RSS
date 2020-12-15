import React from 'react';

import './MenuButton.scss';

interface MapStateToProps {
}

interface MenuButtonProps extends MapStateToProps {
  isSelected: boolean;
  count: number;
  title: string;
  onClick: () => void;
}

class MenuButton extends React.Component<MenuButtonProps> {
  private onClick = () => {
    const { isSelected, onClick } = this.props;

    if (!isSelected) {
      onClick();
    }
  };

  public render() {
    const { isSelected, count, title } = this.props;

    return (
      <button className={`menu_button__container`} onClick={this.onClick}>
        <div className={`menu_button__label ${isSelected ? 'menu_button__label--selected' : ''}`}>{title}</div>
        {isSelected && <div className='menu_button__counter'>{count}</div>}
      </button>
    )
  }
}

export default MenuButton;
