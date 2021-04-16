import React from 'react';
import { CheckmarkIcon, TrashIcon } from '../Icons';

import './FeedItem.scss';

interface FeedProps {
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

  onSelect = (): void => {
    const { id, onSelect } = this.props;
    onSelect(id);
  };

  onDelete = (): void => {
    const { id, onDelete } = this.props;
    onDelete(id);
  };

  onChange = (): void => {
    if (this.titleFieldRef && this.titleFieldRef.current) {
      const { id, onChange } = this.props;
      const value = this.titleFieldRef.current.value;

      onChange(id, value);
    }
  }

  renderViewMode(): JSX.Element {
    const { icon, title, count, isSelected } = this.props;

    return (
      <button className='feed__button' onClick={this.onSelect}>
        <div className='feed__icon' style={{ backgroundImage: `url(${icon})` }} />
        <div className={`feed__label ${isSelected ? 'feed__label--selected' : ''}`}>{title}</div>
        <div className='feed__counter'>{count}</div>
      </button>
    )
  }

  renderEditMode(): JSX.Element {
    const { icon, title } = this.props;

    return (
      <div className='feed__edit_panel'>
        <div className='feed__icon' style={{ backgroundImage: `url(${icon})` }} />
        <input className='feed____title_field' defaultValue={title} type="text" ref={this.titleFieldRef} />
        <button className='feed__edit_button' onClick={this.onChange}><div className='icon'><CheckmarkIcon /></div></button>
        <button className='feed__edit_button' onClick={this.onDelete}><div className='icon'><TrashIcon /></div></button>
      </div>
    )
  }

  public render(): JSX.Element {
    const { isEditing } = this.props;

    return (
      <div className='feed__container'>
        {
          isEditing ? this.renderEditMode() : this.renderViewMode()
        }
      </div>
    );
  }
}

export default FeedItem;
