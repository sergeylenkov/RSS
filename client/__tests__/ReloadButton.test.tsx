import React from 'react';
import renderer  from 'react-test-renderer';
import { action } from '../src/utils/tests';
import ReloadButton from '../src/components/menu/ReloadButton';

test('ReloadButton correct rendering', () => {
  const render = renderer.create(<ReloadButton isActive isError={false} isSelected={false} count={10} onClick={action} onUpdate={action} />);
  expect(render).toMatchSnapshot();
});