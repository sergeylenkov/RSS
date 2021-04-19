import React from 'react';
import renderer  from 'react-test-renderer';
import ReloadButton from '../src/components/menu/ReloadButton';

const action = () => { return };

test('ReloadButton correct rendering', () => {
  const render = renderer.create(<ReloadButton isActive isError={false} isSelected={false} count={10} onClick={action} onUpdate={action} />);
  expect(render).toMatchSnapshot();
});