import * as React from 'react';
import { useSelector } from 'react-redux';
import { getSelectedElement, getParentElementForSelectedElement } from 'selectors/tree';
import { getComponents } from 'selectors/configuration';

import { ElementConfigComponent } from './ElementConfig.component';

export const ElementConfigContainer = (): JSX.Element => {
  const selectedElement = useSelector(getSelectedElement);
  const parentElement = useSelector(getParentElementForSelectedElement);

  const component = useSelector(getComponents).find((c) => {
    if (selectedElement?.type !== 'widget') return false;
    return c.key === selectedElement.component;
  });

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
