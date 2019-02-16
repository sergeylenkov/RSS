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
    }
}

export class Icon extends React.Component {
    render() {
        return (            
            <svg viewBox={this.props.svg.viewBox}>{this.props.svg.path}</svg>
        );        
    }
}