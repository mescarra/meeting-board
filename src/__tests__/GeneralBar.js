import React from 'react';
import { shallow } from 'enzyme';
import GeneralBar from '../GeneralBar';

it('renders without crashing', () => {
  shallow(<GeneralBar />);
});
