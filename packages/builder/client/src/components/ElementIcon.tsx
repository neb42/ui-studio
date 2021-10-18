import * as React from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import * as Icons from '@mui/icons-material';
import { Element, Component } from '@ui-studio/types';
import { getComponents } from 'selectors/configuration';

const getIcon = (element: Element, components: Component[]) => {
  if (element.type === 'page') return Icons.WebSharp;

  if (element.type === 'customComponent' || element.type === 'customComponentInstance')
    return Icons.AppsSharp;

  if (element.type === 'widget') {
    const icon = components.find((c) => c.key === element.component)?.icon ?? '';
    return (Icons as { [key: string]: Icons.SvgIconComponent })?.[icon] ?? Icons.HelpOutlineSharp;
  }

  return Icons.HelpOutlineSharp;
};

interface IElementIcon {
  element: Element;
  color: string;
}

interface IElementIconButton extends IElementIcon {
  onClick: (event?: React.MouseEvent) => any;
}

export const ElementIcon = ({ element, color }: IElementIcon): JSX.Element => {
  const components = useSelector(getComponents);
  const Icon = getIcon(element, components);
  return <Icon style={{ color }} fontSize="small" />;
};

export const ElementIconButton = ({ element, color, onClick }: IElementIconButton): JSX.Element => (
  <IconButton onClick={onClick} size="large">
    <ElementIcon element={element} color={color} />
  </IconButton>
);
