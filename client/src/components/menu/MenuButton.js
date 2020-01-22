import React from 'react';
import { connect } from 'react-redux';

import lightStyles from './MenuButton.module.css';
import darkStyles from './MenuButton.dark.module.css';

export class ConnectedMenuButton extends React.Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    render() {
        const styles = this.props.isDarkTheme ? darkStyles : lightStyles;

        let counter;

        if (this.props.isSelected) {
            counter = <div className={styles.counter}>{this.props.count}</div>
        }

        return (
            <button className={`${styles.container} ${this.props.isSelected ? styles.selected : ''}`} onClick={this.onClick}>
                <div className={styles.label}>{this.props.title}</div>
                {counter}
            </button>
        )
    }

    onClick() {
        if (!this.props.isSelected) {
            this.props.onClick();
        }
    }
}

/* Redux */

const mapStateToProps = state => {
    return {
        isDarkTheme: state.isDarkTheme
    };
};

export const MenuButton = connect(mapStateToProps)(ConnectedMenuButton);