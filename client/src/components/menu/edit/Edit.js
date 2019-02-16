import React from 'react';
import { Icon, Icons } from '../../Icon.js';

import styles from './Edit.module.css';

export class MenuEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFormVisible: false
        }
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
                        <button className={styles.button} onClick={() => this.onAdd()}><div className={styles.icon}><Icon svg={Icons.add}/></div></button>
                        <button className={styles.button} onClick={() => this.onCloseForn()}><div className={styles.icon}><Icon svg={Icons.close}/></div></button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={className}>
                    <button className={styles.button} onClick={() => this.onShowForm()}><div className={styles.icon}><Icon svg={Icons.add}/></div></button>
                    <button className={styles.button} onClick={() => this.props.onEdit()}><div className={styles.icon}><Icon svg={Icons.edit}/></div></button>
                </div>
            );
        }
    }

    onAdd() {

    }

    onShowForm() {
        this.setState({
            isFormVisible: true
        });
    }

    onCloseForn() {
        this.setState({
            isFormVisible: false
        });
    }
}