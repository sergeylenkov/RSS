import React from 'react';
import { Icon, Icons } from '../../Icon.js';

import styles from './Edit.module.css';

export class MenuEdit extends React.Component {
    render() {
        let className = styles.container;

        if (this.props.isDisabled) {
            className += ` ${styles.disabled}`;
        }

        if (this.props.isScrolled) {
            className += ` ${styles.scrolled}`;
        }

        return (
            <div className={className}>
                <button className={styles.button} onClick={() => this.onAdd()}><div className={styles.icon}><Icon svg={Icons.add}/></div></button>
				<button className={styles.button} onClick={() => this.props.onEdit()}><div className={styles.icon}><Icon svg={Icons.edit}/></div></button>
            </div>
        );
    }

    onAdd() {

    }
}