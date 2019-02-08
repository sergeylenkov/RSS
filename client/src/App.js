
import React from 'react';

import { Menu } from './components/menu/Menu.js';

export default class App extends React.Component {
  render() {
    return (
        <div className="application">
            <Menu/>
        </div>
    );
  }
}