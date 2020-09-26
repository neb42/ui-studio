import * as React from 'react';
import { IconButton } from '@material-ui/core';
import {
  GridOnSharp,
  HelpOutlineSharp,
  TextFieldsSharp,
  DashboardSharp,
  ViewWeekSharp,
} from '@material-ui/icons';
import { Element } from '@ui-builder/types';

const getIcon = (element: Element) => {
  if (element.type === 'page') return DashboardSharp;

  if (element.type === 'layout') {
    if (element.layoutType === 'grid') return GridOnSharp;
    if (element.layoutType === 'flex') return ViewWeekSharp;
  }

  if (element.type === 'widget') {
    if (element.component === 'text') return TextFieldsSharp;
  }

  return HelpOutlineSharp;
};

interface IElementIcon {
  element: Element;
  color: string;
}

interface IElementIconButton extends IElementIcon {
  onClick: (event?: React.MouseEvent) => any;
}

export const ElementIcon = ({ element, color }: IElementIcon): JSX.Element => {
  const Icon = getIcon(element);
  return <Icon style={{ color }} fontSize="small" />;
};

export const ElementIconButton = ({ element, color, onClick }: IElementIconButton): JSX.Element => (
  <IconButton onClick={onClick}>
    <ElementIcon element={element} color={color} />
  </IconButton>
);
