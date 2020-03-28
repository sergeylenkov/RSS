import React from 'react';
import { connect } from 'react-redux';
import { toggleTheme, toggleCollapseLong } from '../../store/actions';

import styles from './Settings.module.css';

export class ConnectedSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            days: localStorage.getItem('keepDays')
        };

        this.collapseId = 0;
        this.themeId = 1;

        this.collapseFieldRef = React.createRef();
        this.daysFieldRef = React.createRef();
        this.themeFieldRef = React.createRef();

        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onChangeDays = this.onChangeDays.bind(this);
        this.onToggleTheme = this.onToggleTheme.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    render() {
        if (!this.props.isVisible) {
            return null;
        }

        return (
            <div className={styles.container} onClick={this.onClick}>
                <div className={styles.item}>
                    <input id={this.themeId} className={styles.checkbox} ref={this.themeFieldRef} type="checkbox" checked={this.props.isDarkTheme ? 'checked' : ''} onChange={this.onToggleTheme} />
                    <label className={styles.label} htmlFor={this.themeId}>Темная тема</label>
                </div>

                <div className={styles.item}>
                    <input id={this.collapseId} className={styles.checkbox} ref={this.collapseFieldRef} type="checkbox" checked={this.state.isCollapseLong ? 'checked' : ''} onChange={this.onToggleCollapse} />
                    <label className={styles.label} htmlFor={this.collapseId}>Сворачивать длинные посты</label>
                </div>

                <div className={styles.item}>
                    <div className={styles.label}>Удалять посты старше <input className={styles.days} ref={this.daysFieldRef} type="text" value={this.state.days} onChange={this.onChangeDays}/> дней</div>
                </div>
            </div>
        );
    }

    onToggleCollapse() {
        const isCollapseLong = !this.props.isCollapseLong;
        this.props.toggleCollapseLong(isCollapseLong);
    }

    onChangeDays() {
        const days = this.daysFieldRef.current.value;

        localStorage.setItem('keepDays', days);

        this.setState({
            days: days
        });
    }

    onToggleTheme() {
        const isDarkTheme = !this.props.isDarkTheme;
        this.props.toggleTheme(isDarkTheme);
    }

    onClick(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        isDarkTheme: state.isDarkTheme,
        isCollapseLong: state.isCollapseLong
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleTheme: (isDarkTheme) => dispatch(toggleTheme(isDarkTheme)),
        toggleCollapseLong: (isCollapse) => dispatch(toggleCollapseLong(isCollapse))
    };
};

export const Settings = connect(mapStateToProps, mapDispatchToProps)(ConnectedSettings);
