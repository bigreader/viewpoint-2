import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import DecisionPage from './pages/DecisionPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/dashboard" component={UserPage} />
        <Route path="/decisions/:decision" render={props => <DecisionPage id={props.match.params.decision} />} />
      </Switch>
    </Router>
  );
}

export default App;
