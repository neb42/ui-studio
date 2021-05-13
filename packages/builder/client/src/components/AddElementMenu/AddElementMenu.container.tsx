import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Icons from '@material-ui/icons';
import { Component, CustomComponent } from '@ui-studio/types';
import { getOrphanedRootElements } from 'selectors/element';
import { getSelectedElement, getRoots, getSelectedRootElement } from 'selectors/tree';
import { getComponents } from 'selectors/configuration';
import { addCustomComponentInstance, addWidget, updateWidgetParent } from 'actions/widget';

import { AddElementMenuComponent, WidgetMenuItem } from './AddElementMenu.component';

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

type Props = {
  anchor: HTMLElement | null;
  onClose: () => void;
};

export const AddElementMenuContainer = ({ anchor, onClose }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const [category, setCategory] = React.useState<string | null>(null);
  const rootElement = useSelector(getSelectedRootElement);
  const selectedElement = useSelector(getSelectedElement);
  const components = useSelector(getComponents);
  const customComponents = useSelector(getRoots).filter(
    (e): e is CustomComponent => e.type === 'customComponent',
  );
  const orphanedElements = useSelector(getOrphanedRootElements);

  const elements = makeElements(components);
  const categories = Object.keys(elements);

  const handleClose = () => {
    setCategory(null);
    onClose();
  };

  const handleAddWidget = (key: string, library: string) => {
    if (selectedElement) {
      dispatch(addWidget(key, library, selectedElement.id));
      handleClose();
    }
  };

  const handleAddCustomComponentInstance = (id: string) => {
    if (selectedElement) {
      dispatch(addCustomComponentInstance(id, selectedElement.id));
      handleClose();
    }
  };

  const handleUpdateParent = (orphanId: string) => {
    if (selectedElement) {
      dispatch(updateWidgetParent(orphanId, selectedElement.id));
      handleClose();
    }
  };

  const handleClickCategory = (cat: string | null) => setCategory(cat);

  return (
    <AddElementMenuComponent
      anchor={anchor}
      onClose={handleClose}
      category={category}
      categories={categories}
      elements={elements}
      components={components}
      customComponents={customComponents}
      orphanedElements={orphanedElements}
      onAddWidget={handleAddWidget}
      onAddCustomComponentInstance={handleAddCustomComponentInstance}
      onUpdateParent={handleUpdateParent}
      onClickCategory={handleClickCategory}
      rootIsCustomComponent={rootElement?.type === 'customComponent'}
    />
  );
};
