import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CustomComponent, Page } from '@ui-studio/types';
import { selectRootElement } from 'actions/view';
import { addPage, removePage } from 'actions/page';
import { addCustomComponent, removeCustomComponent } from 'actions/customComponent';
import { getRoots, getSelectedRootElement } from 'selectors/tree';

import { ElementTreeHeaderComponent } from './ElementTreeHeader.component';

export const ElementTreeHeaderContainer = (): JSX.Element => {
  const dispatch = useDispatch();
  const rootElements = useSelector(getRoots);
  const pages = rootElements.filter((e): e is Page => e.type === 'page');
  const customComponents = rootElements.filter(
    (e): e is CustomComponent => e.type === 'customComponent',
  );
  const rootElement = useSelector(getSelectedRootElement);

  const handleOnRootChange = (rootId: string) => {
    dispatch(selectRootElement(rootId));
  };

  const handleOnAddPage = () => {
    dispatch(addPage());
  };

  const handleOnAddCustomComponent = () => {
    dispatch(addCustomComponent());
  };

  const handleOnRemove = () => {
    if (rootElement) {
      if (rootElement.type === 'page') dispatch(removePage(rootElement.id));
      if (rootElement.type === 'customComponent') dispatch(removeCustomComponent(rootElement.id));
    }
  };

  if (!rootElement) return <div />;

  return (
    <ElementTreeHeaderComponent
      pages={pages}
      customComponents={customComponents}
      rootElement={rootElement}
      onRootChange={handleOnRootChange}
      onAddPage={handleOnAddPage}
      onAddCustomComponent={handleOnAddCustomComponent}
      onRemove={handleOnRemove}
    />
  );
};
