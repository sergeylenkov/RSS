import React from 'react';

import styles from './Entry.module.css';

export class Entry extends React.Component {
    render() {
        const description = this.clearSelfLinks(this.props.description, this.props.link);
        
        return (
            <div className={styles.container}>
                <div className={styles.title}><a href={this.props.link}>{this.props.title}</a></div>
                <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }}></div>
            </div>
        );
    }

    clearSelfLinks(description, link) {
        let el = document.createElement('div');       
        el.innerHTML = description;
        
        let items = Array.from(el.getElementsByTagName('a'));

        let links = items.filter((item) => {
            let href = item.getAttribute('href');
    
            if (href && href.indexOf(link) !== -1) {
                return true;
            }
    
            return false;
        });
    
        for (let i = 0; i < links.length; i++) {
            links[i].remove();
        }
    
        return el.innerHTML;
    }    
}