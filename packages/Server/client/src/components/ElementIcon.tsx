import * as React from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import { Element } from '@ui-builder/types';
import { makeGetComponents } from 'selectors/element';
import { IComponent } from 'types/store';

const getIcon = (element: Element, components: IComponent[]) => {
  if (element.type === 'page') return Icons.DashboardSharp;

  if (element.type === 'layout') {
    if (element.layoutType === 'grid') return Icons.GridOnSharp;
    if (element.layoutType === 'flex') return Icons.ViewWeekSharp;
  }

  if (element.type === 'widget') {
    const icon = components.find(c => c.name === element.component)?.icon ?? '';
    return (Icons as {[key: string]: Icons.SvgIconComponent })?.[icon] ?? Icons.HelpOutlineSharp;
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
  const components = useSelector(React.useMemo(makeGetComponents, []));
  const Icon = getIcon(element, components);
  return <Icon style={{ color }} fontSize="small" />;
};

export const ElementIconButton = ({ element, color, onClick }: IElementIconButton): JSX.Element => (
  <IconButton onClick={onClick}>
    <ElementIcon element={element} color={color} />
  </IconButton>
);
