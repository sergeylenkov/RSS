import React from 'react';
import { Icon, Icons } from '../Icon.js';

import styles from './Edit.module.css';

export class FeedEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFormVisible: false
        }

        this.linkFieldRef = React.createRef();
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
                        <button className={styles.formButton} onClick={() => this.onAdd()}><div className={styles.icon}><Icon svg={Icons.add}/></div></button>
                        <button className={styles.formButton} onClick={() => this.onCloseForm()}><div className={styles.icon}><Icon svg={Icons.close}/></div></button>
                    </div>
                </div>
            );
        } else {
            let iconClassName = styles.icon;

            if (this.props.isEdited) {
                iconClassName += ` ${styles.edited}`;
            }

            return (
                <div className={className}>
                    <button className={styles.button} onClick={() => this.onShowForm()}><div className={styles.icon}><Icon svg={Icons.add}/></div></button>
                    <button className={styles.button} onClick={() => this.props.onEdit()}><div className={iconClassName}><Icon svg={Icons.edit}/></div></button>
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

    onShowForm() {
        this.setState({
            isFormVisible: true
        });
    }

    onCloseForm() {
        this.setState({
            isFormVisible: false
        });
    }
}