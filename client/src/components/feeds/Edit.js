import React from 'react';
import { CheckmarkIcon, CloseIcon, AddIcon, EditIcon } from '../Icons.js';

import styles from './Edit.module.css';

export class FeedEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFormVisible: false
        }

        this.linkFieldRef = React.createRef();

        this.onAdd = this.onAdd.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onShow = this.onShow.bind(this);
    }

    render() {
        let className = styles.container;

        if (this.props.isDisabled) {
            className += ` ${styles.disabled}`;
        }

        if (this.props.isScrolled) {
            className += ` ${styles.scrolled}`;
        }

        if (this.state.isFormVisible) {
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

            if (this.props.isEditing) {
                iconClassName += ` ${styles.editing}`;
            }

            return (
                <div className={className}>
                    <button className={styles.button} onClick={this.onShow}><div className={styles.icon}><AddIcon /></div></button>
                    <button className={styles.button} onClick={this.props.onEdit}><div className={iconClassName}><EditIcon /></div></button>
                </div>
            );
        }
    }

    onAdd() {
        const value = this.linkFieldRef.current.value;

        if (value.length > 0) {
            this.props.onAdd(value);
        }
    }

    onShow() {
        this.setState({
            isFormVisible: true
        });
    }

    onClose() {
        this.setState({
            isFormVisible: false
        });
    }
}