import React from 'react';

import styles from './Empty.module.css';

export class EmptyList extends React.Component {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.header}>Нет новых постов.</div>
                <div className={styles.buttons}>
                    Посмотреть
                    <button className={styles.button} onClick={this.props.onShowLast}>прошлые</button>
                    <button className={styles.button} onClick={this.props.onShowFavorites}>избранное</button>
                    <button className={styles.button} onClick={this.props.onShowRead}>прочитанное</button>
                </div>
            </div>
        );
    }
}