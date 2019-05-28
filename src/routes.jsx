import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Demo from './Demo';
import Address from './Address';

export default class AppRouter extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/page/Demo" component={Demo} />
            <Route path="/page/Address" component={Address} />
          </Switch>
        </div>
      </Router>
    );
  }
}
