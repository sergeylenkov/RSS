import React from 'react';
import renderer  from 'react-test-renderer';
import MenuButton from '../src/components/menu/MenuButton';

const action = () => { return };

test('MenuButton correct rendering', () => {
  const render = renderer.create(<MenuButton title={'Test'} isSelected count={10} onClick={action} />);
  expect(render).toMatchSnapshot();
});