import React from 'react';

export const Icons = {
    reload: {
        viewBox: '0 0 24 24',
        path: <g><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></g>
    }
}

export class Icon extends React.Component {
    render() {
        return (            
            <svg viewBox={this.props.svg.viewBox}>{this.props.svg.path}</svg>
        );        
    }
}