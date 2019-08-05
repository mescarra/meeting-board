import React from 'react';
import { shallow } from 'enzyme';
import TagCard from '../TagCard';

it('renders without crashing', () => {
  shallow(<TagCard tasksPerSquad={[]} />);
});
