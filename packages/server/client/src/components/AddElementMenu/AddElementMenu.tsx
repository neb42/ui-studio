import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, ListItemIcon, MenuItem, Divider } from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import { Component } from 'canvas-types';
import {
  makeGetSelectedElement,
  makeGetComponents,
  getOrphanedRootElements,
} from 'selectors/element';
import { addWidget, updateWidgetParent } from 'actions/widget';

const makeElements = (
  components: Component[],
): {
  [key: string]: {
    title: string;
    description: string;
    type: 'layout' | 'widget';
    subtype: string;
    library: string;
    icon: Icons.SvgIconComponent;
  }[];
} => {
  const elements: {
    [key: string]: {
      title: string;
      description: string;
      type: 'layout' | 'widget';
      subtype: string;
      library: string;
      icon: Icons.SvgIconComponent;
    }[];
  } = {};

  components.forEach(({ name, description, category, icon, library }) => {
    const existing = elements[category] || [];
    existing.push({
      title: name,
      description,
      type: 'widget',
      subtype: name,
      library,
      icon: (Icons as { [key: string]: Icons.SvgIconComponent })?.[icon] ?? Icons.HelpOutlineSharp,
    });
    elements[category] = existing;
  });

  return elements;
};

interface IAddElementMenu {
  anchor: HTMLElement | null;
  onClose: () => void;
}

export const AddElementMenu = ({ anchor, onClose }: IAddElementMenu): JSX.Element => {
  const dispatch = useDispatch();
  const [category, setCategory] = React.useState<string | null>(null);
  const selectedElement = useSelector(React.useMemo(makeGetSelectedElement, []));
  const components = useSelector(React.useMemo(makeGetComponents, []));
  const orphanedElements = useSelector(getOrphanedRootElements);

  const showOrphanedElements = category === 'Orphaned elements';

  const elements = makeElements(components);
  const categories = Object.keys(elements);

  const handleAddElement = (subtype: string, library: string) => () => {
    if (selectedElement) {
      dispatch(addWidget(subtype, library, selectedElement.id));
      onClose();
      setCategory(null);
    }
  };

  const handleUpdateParent = (orphanId: string) => () => {
    if (selectedElement) {
      dispatch(updateWidgetParent(orphanId, selectedElement.id));
      onClose();
      setCategory(null);
    }
  };

  const handleClickCategory = (cat: string | null) => () => setCategory(cat);

  if (category === null) {
    return (
      <Menu keepMounted anchorEl={anchor} open={Boolean(anchor)} onClose={onClose}>
        {categories.map((c) => (
          <MenuItem key={c} onClick={handleClickCategory(c)}>
            {c}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleClickCategory('Orphaned elements')}>Orphaned elements</MenuItem>
      </Menu>
    );
  }

  return (
    <Menu keepMounted anchorEl={anchor} open={Boolean(anchor)} onClose={onClose}>
      <MenuItem onClick={handleClickCategory(null)}>
        <ListItemIcon>
          <Icons.ChevronLeftSharp />
        </ListItemIcon>
        {category}
      </MenuItem>
      {!showOrphanedElements &&
        (elements?.[category] ?? []).map((e) => (
          <MenuItem key={e.title} onClick={handleAddElement(e.subtype, e.library)}>
            <ListItemIcon>
              <e.icon />
            </ListItemIcon>
            {e.title}
          </MenuItem>
        ))}
      {showOrphanedElements &&
        orphanedElements.map((e) => {
          const Icon = (() => {
            const comp = components.find((c) => c.name === e.component);
            if (!comp) throw Error();
            return (
              (Icons as { [key: string]: Icons.SvgIconComponent })?.[comp.icon] ??
              Icons.HelpOutlineSharp
            );
          })();
          return (
            <MenuItem key={e.id} onClick={handleUpdateParent(e.id)}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              {e.name}
            </MenuItem>
          );
        })}
    </Menu>
  );
};
