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
  color?: string;
  [x: string]: any;
}

interface IElementIconButton extends IElementIcon {
  onClick: (event?: React.MouseEvent) => any;
}

export const ElementIcon = ({ element, color, ...other }: IElementIcon): JSX.Element => {
  const components = useSelector(getComponents);
  const Icon = getIcon(element, components);
  const style = color ? { color } : {};
  return <Icon style={style} fontSize="small" {...other} />;
};

export const ElementIconButton = ({ element, color, onClick }: IElementIconButton): JSX.Element => (
  <IconButton onClick={onClick} size="small">
    <ElementIcon element={element} color={color} />
  </IconButton>
);
