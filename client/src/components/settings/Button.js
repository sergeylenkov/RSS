import React from 'react';
import { connect } from 'react-redux';
import { SettingsIcon } from '../Icons.js';

import lightStyles from './Button.module.css';
import darkStyles from './Button.dark.module.css';

export class ConnectedSettingsButton extends React.Component {
    render() {
        let styles = {};

        if (this.props.isDarkTheme) {
            styles = {...lightStyles, ...darkStyles};
        } else {
            styles = lightStyles;
        }

        return (
            <button className={`${styles.container} ${this.props.isActive ? styles.active : ''}`} onClick={this.props.onClick}>
                <div className={styles.icon}><SettingsIcon /></div>
            </button>
        );
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        isDarkTheme: state.isDarkTheme
    };
};

export const SettingsButton = connect(mapStateToProps)(ConnectedSettingsButton);