import React from 'react';

import styles from './Settings.module.css';

export class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            collapse: localStorage.getItem('collpaseLong'),
            days: localStorage.getItem('keepDays')
        }

        this.collapseId = 0;
        this.collapseFieldRef = React.createRef();
        this.daysFieldRef = React.createRef();

        this.onToggleCollapse = this.onToggleCollapse.bind(this);
        this.onChangeDays = this.onChangeDays.bind(this);
    }

    render() {
        if (!this.props.isVisible) {
            return null;
        }

        let collapse = "";

        if (this.state.collapse) {
            collapse = "checked";
        }

        return (
            <div className={styles.container}>
                <div className={styles.item}>
                    <input id={this.collapseId} className={styles.checkbox} ref={this.collapseFieldRef} type="checkbox" checked={collapse} onChange={this.onToggleCollapse} />                    
                    <label className={styles.label} htmlFor={this.collapseId}>Обрезать длинные посты</label>
                </div>

                <div className={styles.item}>
                    <div className={styles.label}>Удалять посты старше <input className={styles.days} ref={this.daysFieldRef} type="text" value={this.state.days} onChange={this.onChangeDays}/> дней</div>
                </div>
            </div>            
        );        
    }

    onToggleCollapse() {
        const collapse = this.collapseFieldRef.current.checked;

        localStorage.setItem('collpaseLong', collapse);

        this.setState({
            collapse: collapse
        });
    }

    onChangeDays() {
        console.log(this.daysFieldRef.current.value);
        const days = this.daysFieldRef.current.value;

        localStorage.setItem('keepDays', days);

        this.setState({
            days: days
        });
    }
}