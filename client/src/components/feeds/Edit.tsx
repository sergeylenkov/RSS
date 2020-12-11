import React from 'react';
import { CheckmarkIcon, CloseIcon, AddIcon, EditIcon } from '../Icons';

import './Edit.scss';

interface FeedEditProps {
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
    const { isDisabled, isScrolled, isEditing, onEdit } = this.props;
    const { isFormVisible } = this.state;
    const className = `edit__container ${isDisabled ? 'edit__container--disabled' : ''} ${isScrolled ? 'edit__container--scrolled' : ''}`;

    if (isFormVisible) {
      return (
        <div className={className}>
          <div className='edit__form'>
            <input className='edit__link_field' placeholder="ссылка на канал" type="text" ref={this.linkFieldRef} />
            <button className='edit__form_button' onClick={this.onAdd}><div className='edit__icon'><CheckmarkIcon /></div></button>
            <button className='edit__form_button' onClick={this.onClose}><div className='edit__icon'><CloseIcon /></div></button>
          </div>
        </div>
      );
    } else {
      return (
        <div className={className}>
          <button className='edit__button' onClick={this.onShow}><div className='edit__icon'><AddIcon /></div></button>
          <button className='edit__button' onClick={onEdit}><div className={`edit__icon ${isEditing ? 'edit__icon--editing' : ''}`}><EditIcon /></div></button>
        </div>
      );
    }
  }
}

export default FeedEdit;
