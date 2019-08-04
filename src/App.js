import React from 'react';
import GeneralBoard from './GeneralBoard';
import SquadBoard from './SquadBoard';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={GeneralBoard} />
      <Route path="/squads/:id" component={SquadBoard} />
    </Router>
  );
};

export default App;
