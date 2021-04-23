import React from 'react';
import renderer  from 'react-test-renderer';
import { AddIcon, CheckmarkIcon, CloseIcon, EditIcon, FavoriteIcon, FavoriteSelectedIcon, ReadIcon, ReloadIcon, SettingsIcon, TrashIcon } from '../src/components/Icons';

test('ReloadIcon', () => {
  const render = renderer.create(<ReloadIcon />);
  expect(render).toMatchSnapshot();
});

test('AddIcon', () => {
  const render = renderer.create(<AddIcon />);
  expect(render).toMatchSnapshot();
});

test('EditIcon', () => {
  const render = renderer.create(<EditIcon />);
  expect(render).toMatchSnapshot();
});

test('CloseIcon', () => {
  const render = renderer.create(<CloseIcon />);
  expect(render).toMatchSnapshot();
});

test('TrashIcon', () => {
  const render = renderer.create(<TrashIcon />);
  expect(render).toMatchSnapshot();
});

test('SettingsIcon', () => {
  const render = renderer.create(<SettingsIcon />);
  expect(render).toMatchSnapshot();
});

test('ReadIcon', () => {
  const render = renderer.create(<ReadIcon />);
  expect(render).toMatchSnapshot();
});

test('FavoriteIcon', () => {
  const render = renderer.create(<FavoriteIcon />);
  expect(render).toMatchSnapshot();
});

test('FavoriteSelectedIcon', () => {
  const render = renderer.create(<FavoriteSelectedIcon />);
  expect(render).toMatchSnapshot();
});

test('CheckmarkIcon', () => {
  const render = renderer.create(<CheckmarkIcon />);
  expect(render).toMatchSnapshot();
});