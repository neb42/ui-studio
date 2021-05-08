import * as React from 'react';
import { useSelector } from 'react-redux';
import { CustomComponent } from '@ui-studio/types';
import { getSelectedElement, getParentElementForSelectedElement, getRoots } from 'selectors/tree';
import { getComponents } from 'selectors/configuration';

import { ElementConfigComponent } from './ElementConfig.component';

export const ElementConfigContainer = (): JSX.Element => {
  const selectedElement = useSelector(getSelectedElement);
  const parentElement = useSelector(getParentElementForSelectedElement);

  const roots = useSelector(getRoots);
  const components = useSelector(getComponents);

  const component = (() => {
    if (selectedElement) {
      if (selectedElement.type === 'widget') {
        const comp = components.find((c) => c.key === selectedElement.component);
        return comp;
      }
      if (selectedElement.type === 'customComponentInstance') {
        const comp = roots.find(
          (c): c is CustomComponent =>
            c.id === selectedElement.customComponentId && c.type === 'customComponent',
        );
        return comp;
      }
    }
    return null;
  })();

  const hasConfig = Boolean(component && component.config && component.config.length > 0);
  const hasEvents = Boolean(component && component.events && component.events.length > 0);
  const hasLayout = Boolean(component?.hasLayout);

  return (
    <ElementConfigComponent
      selectedElement={selectedElement}
      parentElement={parentElement}
      hasConfig={hasConfig}
      hasEvents={hasEvents}
      hasLayout={hasLayout}
    />
  );
};
