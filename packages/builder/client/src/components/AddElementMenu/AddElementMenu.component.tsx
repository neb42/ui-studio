import * as React from 'react';
import { Menu, ListItemIcon, MenuItem, Divider } from '@material-ui/core';
import * as Icons from '@material-ui/icons';
import { Component, Widget, CustomComponent, CustomComponentInstance } from '@ui-studio/types';

export type WidgetMenuItem = {
  key: string;
  name: string;
  library: string;
  icon: Icons.SvgIconComponent;
};

type Props = {
  anchor: HTMLElement | null;
  onClose: () => void;
  category: string | null;
  categories: string[];
  elements: {
    [key: string]: WidgetMenuItem[];
  };
  components: Component[];
  customComponents: CustomComponent[];
  orphanedElements: (Widget | CustomComponentInstance)[];
  rootIsCustomComponent: boolean;
  onAddWidget: (key: string, library: string) => any;
  onAddCustomComponentInstance: (id: string) => any;
  onUpdateParent: (orphanId: string) => any;
  onClickCategory: (cat: string | null) => any;
};

const sortCategory = (a: { name: string }, b: { name: string }) => {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
};

export const AddElementMenuComponent = ({
  anchor,
  onClose,
  category,
  categories,
  elements,
  components,
  customComponents,
  orphanedElements,
  rootIsCustomComponent,
  onAddWidget,
  onAddCustomComponentInstance,
  onUpdateParent,
  onClickCategory,
}: Props): JSX.Element => {
  const showOrphanedElements = category === '__ORPHANED_ELEMENTS__';
  const showCustomComponents = category === '__CUSTOM__COMPONENTS__';

  const handleAddWidget = (key: string, library: string) => () => {
    onAddWidget(key, library);
  };

  const handleAddCustomComponentInstance = (id: string) => () => {
    onAddCustomComponentInstance(id);
  };

  const handleUpdateParent = (orphanId: string) => () => {
    onUpdateParent(orphanId);
  };

  const handleClickCategory = (cat: string | null) => () => onClickCategory(cat);

  const getCategoryName = (cat: string) => {
    if (cat === '__CUSTOM__COMPONENTS__') return 'Components';
    if (cat === '__ORPHANED_ELEMENTS__') return 'Orphaned elements';
    return cat;
  };

  if (category === null) {
    return (
      <Menu keepMounted anchorEl={anchor} open={Boolean(anchor)} onClose={onClose}>
        {categories.sort().map((c) => (
          <MenuItem key={c} onClick={handleClickCategory(c)}>
            {c}
          </MenuItem>
        ))}
        {!rootIsCustomComponent &&
          customComponents.length > 0 && [
            <Divider key="custom-component-divider" />,
            <MenuItem
              key="custom-component-menu-item"
              onClick={handleClickCategory('__CUSTOM__COMPONENTS__')}
            >
              Components
            </MenuItem>,
          ]}
        {orphanedElements.length > 0 && [
          <Divider key="orphaned-elements-divider" />,
          <MenuItem
            key="orphaned-elements-menu-item"
            onClick={handleClickCategory('__ORPHANED_ELEMENTS__')}
          >
            Orphaned elements
          </MenuItem>,
        ]}
      </Menu>
    );
  }

  return (
    <Menu keepMounted anchorEl={anchor} open={Boolean(anchor)} onClose={onClose}>
      <MenuItem onClick={handleClickCategory(null)}>
        <ListItemIcon>
          <Icons.ChevronLeftSharp />
        </ListItemIcon>
        {getCategoryName(category)}
      </MenuItem>
      {showCustomComponents &&
        (customComponents || []).sort(sortCategory).map((e) => (
          <MenuItem key={e.name} onClick={handleAddCustomComponentInstance(e.id)}>
            {e.name}
          </MenuItem>
        ))}
      {!showOrphanedElements &&
        !showCustomComponents &&
        (elements?.[category] ?? []).sort(sortCategory).map((e) => (
          <MenuItem key={e.name} onClick={handleAddWidget(e.key, e.library)}>
            <ListItemIcon>
              <e.icon />
            </ListItemIcon>
            {e.name}
          </MenuItem>
        ))}
      {showOrphanedElements &&
        orphanedElements.map((e) => {
          const Icon = (() => {
            if (e.type === 'customComponentInstance') return Icons.AppsSharp;
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
