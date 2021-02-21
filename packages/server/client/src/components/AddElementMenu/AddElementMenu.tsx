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
import { addLayout, updateLayoutParent } from 'actions/layout';

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
  } = {
    Layout: [
      {
        title: 'Grid layout',
        description: '',
        type: 'layout',
        subtype: 'grid',
        library: '',
        icon: Icons.GridOnSharp,
      },
      {
        title: 'Flex layout',
        description: '',
        type: 'layout',
        subtype: 'flex',
        library: '',
        icon: Icons.ViewWeekSharp,
      },
      // {
      //   title: 'Conditional render',
      //   description: '',
      //   type: 'layout',
      //   subtype: 'conditional',
      //   library: '',
      // },
    ],
  };

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

  const handleAddElement = (type: 'layout' | 'widget', subtype: string, library: string) => () => {
    if (selectedElement) {
      if (type === 'layout') {
        if (subtype === 'grid') {
          dispatch(addLayout('grid', selectedElement.id));
        }
        if (subtype === 'flex') {
          dispatch(addLayout('flex', selectedElement.id));
        }
      }
      if (type === 'widget') {
        dispatch(addWidget(subtype, library, selectedElement.id));
      }
      onClose();
      setCategory(null);
    }
  };

  const handleUpdateParent = (type: 'layout' | 'widget', orphanId: string) => () => {
    if (selectedElement) {
      if (type === 'layout') {
        dispatch(updateLayoutParent(orphanId, selectedElement.id));
      }
      if (type === 'widget') {
        dispatch(updateWidgetParent(orphanId, selectedElement.id));
      }
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
          <MenuItem key={e.title} onClick={handleAddElement(e.type, e.subtype, e.library)}>
            <ListItemIcon>
              <e.icon />
            </ListItemIcon>
            {e.title}
          </MenuItem>
        ))}
      {showOrphanedElements &&
        orphanedElements.map((e) => {
          const Icon = (() => {
            if (e.type === 'layout') {
              if (e.layoutType === 'grid') return Icons.GridOnSharp;
              if (e.layoutType === 'flex') return Icons.ViewWeekSharp;
              throw Error();
            }
            const comp = components.find((c) => c.name === e.component);
            if (!comp) throw Error();
            return (
              (Icons as { [key: string]: Icons.SvgIconComponent })?.[comp.icon] ??
              Icons.HelpOutlineSharp
            );
          })();
          return (
            <MenuItem key={e.id} onClick={handleUpdateParent(e.type, e.id)}>
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
