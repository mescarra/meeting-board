import React from 'react';
import { shallow } from 'enzyme';
import Tag from '../Tag';

it('renders without crashing', () => {
  shallow(<Tag tag={{ name: '' }} classNames={{}} />);
});
