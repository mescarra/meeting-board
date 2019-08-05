import React from 'react';
import { shallow } from 'enzyme';
import TaskTable from '../TaskTable';

it('renders without crashing', () => {
  shallow(<TaskTable />);
});
