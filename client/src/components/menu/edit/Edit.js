import React from 'react';
import { Icon, Icons } from '../../Icon.js';

import styles from './Edit.module.css';

export class MenuEdit extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <button className={styles.button} onClick={() => this.onAdd()}><div className={styles.icon}><Icon svg={Icons.add}/></div></button>
				<button className={styles.button} onClick={() => this.props.onEdit()}><div className={styles.icon}><Icon svg={Icons.edit}/></div></button>
            </div>
        );
    }

    onAdd() {

    }
}