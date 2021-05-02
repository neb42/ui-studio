import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TreeSourcePosition, TreeDestinationPosition } from '@atlaskit/tree';
import { Widget } from '@ui-studio/types';

import { getSelectedElement, getSelectedTree } from 'selectors/tree';
import { getSelectedRootId } from 'selectors/view';
import { selectElement, hoverElement } from 'actions/view';
import { removeWidget, updateWidgetPosition } from 'actions/tree/widget';

import { ElementTreeComponent } from './ElementTree.component';

export const ElementTreeContainer = (): JSX.Element | null => {
  const dispatch = useDispatch();
  const tree = useSelector(getSelectedTree);
  const selectedElement = useSelector(getSelectedElement);
  const rootId = useSelector(getSelectedRootId);
  const [dragId, setDragId] = React.useState<string | null>(null);

  const handleSelect = (nodeId: string) => {
    dispatch(selectElement(nodeId));
  };

  const handleOnHover = (nodeId: string | null) => dispatch(hoverElement(nodeId));

  const handleOnDragStart = (nodeId: string) => setDragId(nodeId);

  const handleOnDragEnd = (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
    if (
      !dragId ||
      !destination ||
      destination.parentId === 'root' ||
      !tree[destination.parentId].hasChildren
    )
      return;
    dispatch(
      updateWidgetPosition(
        dragId,
        { parentId: source.parentId.toString(), position: source.index },
        { parentId: destination.parentId.toString(), position: destination.index || 0 },
      ),
    );
  };

  const handleRemove = (widget: Widget) => {
    dispatch(removeWidget(widget));
  };

  if (!tree) return null;

  return (
    <ElementTreeComponent
      rootId={rootId}
      selectedElement={selectedElement}
      tree={tree}
      onSelect={handleSelect}
      onHover={handleOnHover}
      onRemove={handleRemove}
      onDragStart={handleOnDragStart}
      onDragEnd={handleOnDragEnd}
    />
  );
};
