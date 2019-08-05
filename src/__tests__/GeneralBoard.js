import React from 'react';
import { shallow } from 'enzyme';
import GeneralBoard from '../GeneralBoard';

it('renders without crashing', () => {
  shallow(<GeneralBoard />);
});
