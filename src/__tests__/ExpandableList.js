import React from 'react';
import { shallow } from 'enzyme';
import ExpandableList from '../ExpandableList';

it('renders without crashing', () => {
  shallow(<ExpandableList tasks={[]} />);
});
