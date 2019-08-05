import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import SquadBoard from '../SquadBoard';

const SquadBoardRoutes = () => {
  return (
    <MemoryRouter initialEntries={['/squads/1']}>
      <Route component={SquadBoard} />
    </MemoryRouter>
  );
};

it('renders without crashing', () => {
  shallow(<SquadBoardRoutes />);
});
