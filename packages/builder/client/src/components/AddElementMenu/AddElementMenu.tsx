import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, ListItemIcon, MenuItem, Divider } from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import { Component } from '@ui-studio/types';
import {
  makeGetSelectedElement,
  makeGetComponents,
  getOrphanedRootElements,
} from 'selectors/element';
import { addWidget, updateWidgetParent } from 'actions/widget';

type WidgetMenuItem = {
  key: string;
  name: string;
  library: string;
  icon: Icons.SvgIconComponent;
};

const makeElements = (
  components: Component[],
): {
  [key: string]: WidgetMenuItem[];
} => {
  const elements: {
    [key: string]: WidgetMenuItem[];
  } = {};

  components.forEach(({ key, name, category, icon, library }) => {
    const existing = elements[category] || [];
    existing.push({
      key,
      name,
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

const sortCategory = (a: WidgetMenuItem, b: WidgetMenuItem) => {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
};

export const AddElementMenu = ({ anchor, onClose }: IAddElementMenu): JSX.Element => {
  const dispatch = useDispatch();
  const [category, setCategory] = React.useState<string | null>(null);
  const selectedElement = useSelector(React.useMemo(makeGetSelectedElement, []));
  const components = useSelector(React.useMemo(makeGetComponents, []));
  const orphanedElements = useSelector(getOrphanedRootElements);

  const showOrphanedElements = category === 'Orphaned elements';

  const elements = makeElements(components);
  const categories = Object.keys(elements);

  const handleAddElement = (key: string, library: string) => () => {
    if (selectedElement) {
      dispatch(addWidget(key, library, selectedElement.id));
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
        {categories.sort().map((c) => (
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
        (elements?.[category] ?? []).sort(sortCategory).map((e) => (
          <MenuItem key={e.name} onClick={handleAddElement(e.key, e.library)}>
            <ListItemIcon>
              <e.icon />
            </ListItemIcon>
            {e.name}
          </MenuItem>
        ))}
      {showOrphanedElements &&
        orphanedElements.map((e) => {
          const Icon = (() => {
            const comp = components.find((c) => c.key === e.component);
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
