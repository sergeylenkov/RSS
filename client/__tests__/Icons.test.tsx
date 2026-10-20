import React from 'react';
import { render } from '@testing-library/react';
import {
  AddIcon,
  CheckmarkIcon,
  CloseIcon,
  EditIcon,
  FavoriteIcon,
  FavoriteSelectedIcon,
  ReadIcon,
  ReloadIcon,
  SettingsIcon,
  TrashIcon,
} from '../src/components/Icons';

const icons = {
  ReloadIcon,
  AddIcon,
  EditIcon,
  CloseIcon,
  TrashIcon,
  SettingsIcon,
  ReadIcon,
  FavoriteIcon,
  FavoriteSelectedIcon,
  CheckmarkIcon,
};

describe('Icons', () => {
  Object.entries(icons).forEach(([name, Icon]) => {
    test(`renders ${name} as svg`, () => {
      const { container } = render(<Icon />);

      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });
});