import React from 'react';

export const Icons = {
    reload: {
        viewBox: '0 0 24 24',
        path: <g><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></g>
    },
    add: {
        viewBox: '0 0 24 24',
        path: <g><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></g>
    },
    edit: {
        viewBox: '0 0 24 24',
        path: <polygon points="16 3 21 8 8 21 3 21 3 16 16 3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    },
    close: {
        viewBox: '0 0 24 24',
        path: <g><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></g>
    },
    trash: {
        viewBox: '0 0 24 24',
        path: <g><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></g>
    }
}

export class Icon extends React.Component {
    render() {
        return (            
            <svg viewBox={this.props.svg.viewBox}>{this.props.svg.path}</svg>
        );        
    }
}