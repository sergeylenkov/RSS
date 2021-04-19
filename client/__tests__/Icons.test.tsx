import React from 'react';
import renderer  from 'react-test-renderer';
import { AddIcon, CheckmarkIcon, CloseIcon, EditIcon, FavoriteIcon, FavoriteSelectedIcon, ReadIcon, ReloadIcon, SettingsIcon, TrashIcon } from '../src/components/Icons';

test('ReloadIcon correct rendering', () => {
  const render = renderer.create(<ReloadIcon />);
  expect(render).toMatchSnapshot();
});

test('AddIcon correct rendering', () => {
  const render = renderer.create(<AddIcon />);
  expect(render).toMatchSnapshot();
});

test('EditIcon correct rendering', () => {
  const render = renderer.create(<EditIcon />);
  expect(render).toMatchSnapshot();
});

test('CloseIcon correct rendering', () => {
  const render = renderer.create(<CloseIcon />);
  expect(render).toMatchSnapshot();
});

test('TrashIcon correct rendering', () => {
  const render = renderer.create(<TrashIcon />);
  expect(render).toMatchSnapshot();
});

test('SettingsIcon correct rendering', () => {
  const render = renderer.create(<SettingsIcon />);
  expect(render).toMatchSnapshot();
});

test('ReadIcon correct rendering', () => {
  const render = renderer.create(<ReadIcon />);
  expect(render).toMatchSnapshot();
});

test('FavoriteIcon correct rendering', () => {
  const render = renderer.create(<FavoriteIcon />);
  expect(render).toMatchSnapshot();
});

test('FavoriteSelectedIcon correct rendering', () => {
  const render = renderer.create(<FavoriteSelectedIcon />);
  expect(render).toMatchSnapshot();
});

test('CheckmarkIcon correct rendering', () => {
  const render = renderer.create(<CheckmarkIcon />);
  expect(render).toMatchSnapshot();
});