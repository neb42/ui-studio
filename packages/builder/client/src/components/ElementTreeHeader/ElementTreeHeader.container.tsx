import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CustomComponent, Page } from '@ui-studio/types';
import { selectRootElement } from 'actions/view';
import { addPage, addCustomComponent, removeRoot } from 'actions/tree/root';
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
      dispatch(removeRoot(rootElement.id));
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
