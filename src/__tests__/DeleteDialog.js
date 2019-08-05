import React from 'react';
import { shallow } from 'enzyme';
import DeleteDialog from '../GeneralBar';

it('renders without crashing', () => {
  shallow(<DeleteDialog />);
});
