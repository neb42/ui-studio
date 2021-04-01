import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Tree, {
  RenderItemParams,
  TreeItem,
  TreeSourcePosition,
  TreeDestinationPosition,
} from '@atlaskit/tree';
import { IconButton } from '@material-ui/core';
import { ClearSharp, AddSharp } from '@material-ui/icons';
import { Page, Widget } from 'canvas-types';
import { getElementTree, makeGetSelectedElement } from 'selectors/element';
import { selectElement, hoverElement, updateElementPosition } from 'actions/element';
import { removeWidget } from 'actions/widget';
import { ElementIcon } from 'components/ElementIcon';
import { ElementTreeHeader } from 'components/ElementTreeHeader';
import { AddElementMenu } from 'components/AddElementMenu';

import * as Styles from './ElementTree.styles';

interface IElementTree {
  pageId: string;
}

interface ITreeItemLabel {
  selectedElement: Page | Widget | null;
  onClick: (id: string) => () => void;
  onMouseEnter: (id: string) => () => void;
  onMouseLeave: () => void;
  onRemove: (element: Widget) => any;
  handleOpenAddElementMenu: (anchor: HTMLElement) => void;
}

const TreeItemLabelBuilder = ({
  selectedElement,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onRemove,
  handleOpenAddElementMenu,
}: ITreeItemLabel) => {
  const ItemTreeLabel = ({
    item,
    onExpand,
    onCollapse,
    provided,
  }: RenderItemParams): React.ReactNode => {
    const { element } = item.data;

    const handleOpenAddMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
      handleOpenAddElementMenu(event.currentTarget);

    const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      onRemove(element);
    };

    const handleDoubleClick = () => {
      if (item.hasChildren && item.children.length > 0) {
        if (item.isExpanded) return onCollapse(item.id);
        return onExpand(item.id);
      }
    };

    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={provided.draggableProps.style}
      >
        <Styles.TreeItemLabel
          onClick={onClick(element.id)}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={onMouseEnter(element.id)}
          onMouseLeave={onMouseLeave}
          active={element.id === selectedElement?.id}
        >
          <ElementIcon element={element} color="#000" />
          <Styles.ElementName>{element.name}</Styles.ElementName>
          <Styles.TreeItemActions
            selected={Boolean(selectedElement && selectedElement.id === element.id)}
          >
            {(element.type === 'page' || element.type === 'overlay') && <div />}
            {element.type !== 'widget' || element.hasChildren ? (
              <IconButton onClick={handleOpenAddMenu} size="small">
                <AddSharp />
              </IconButton>
            ) : (
              <div />
            )}
            {element.type !== 'page' && element.type !== 'overlay' && (
              <IconButton onClick={handleRemove} size="small">
                <ClearSharp />
              </IconButton>
            )}
          </Styles.TreeItemActions>
        </Styles.TreeItemLabel>
      </div>
    );
  };
  return ItemTreeLabel;
};

export const ElementTree = ({ pageId }: IElementTree): JSX.Element | null => {
  const dispatch = useDispatch();
  const [addElementMenuAnchor, setAddElementMenuAnchor] = React.useState<HTMLElement | null>(null);
  const elementTree = useSelector(getElementTree);
  const selectedElement = useSelector(React.useMemo(makeGetSelectedElement, []));
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [collapseMap, setCollapseMap] = React.useState<{ [key: string]: boolean }>({});

  const handleCloseAddElementMenu = () => setAddElementMenuAnchor(null);

  const handleSelect = (nodeId: string) => () => {
    dispatch(selectElement(nodeId));
  };

  const handleMouseEnter = (nodeId: string) => () => {
    dispatch(hoverElement(nodeId));
  };

  const handleMouseLeave = () => {
    dispatch(hoverElement(null));
  };

  const handleUpdateParent = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => {
    if (
      !dragId ||
      !destination ||
      destination.parentId === 'root' ||
      !elementTree[destination.parentId].hasChildren
    )
      return;
    dispatch(
      updateElementPosition(
        dragId,
        { parentId: source.parentId.toString(), position: source.index },
        { parentId: destination.parentId.toString(), position: destination.index || 0 },
      ),
    );
  };

  const handleRemove = (element: Widget) => {
    dispatch(removeWidget(element));
  };

  const handleExpand = (id: string | number) => {
    setCollapseMap({
      ...collapseMap,
      [id.toString()]: false,
    });
  };

  const handleCollapse = (id: string | number) => {
    if (elementTree[id.toString()].children.length === 0) return;
    setCollapseMap({
      ...collapseMap,
      [id.toString()]: true,
    });
  };

  if (!elementTree) return null;

  const tree: Record<string, TreeItem> = Object.keys(elementTree).reduce((acc, cur) => {
    const expanded = cur in collapseMap ? !collapseMap[cur] : true;
    return {
      ...acc,
      [cur]: {
        ...elementTree[cur],
        isExpanded: expanded,
      },
    };
  }, {});

  const ItemTreeLabel = TreeItemLabelBuilder({
    selectedElement,
    onClick: handleSelect,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onRemove: handleRemove,
    handleOpenAddElementMenu: setAddElementMenuAnchor,
  });

  return (
    <Styles.Container>
      <ElementTreeHeader />
      <Styles.Tree>
        <Tree
          tree={{
            rootId: 'root',
            items: {
              root: {
                id: 'root',
                children: [pageId],
              },
              ...tree,
            },
          }}
          renderItem={ItemTreeLabel}
          onDragStart={(id) => setDragId(id.toString())}
          onDragEnd={handleUpdateParent}
          onCollapse={handleCollapse}
          onExpand={handleExpand}
          offsetPerLevel={8}
          isDragEnabled={(id) => id.toString() !== pageId}
          isNestingEnabled
        />
      </Styles.Tree>
      <AddElementMenu anchor={addElementMenuAnchor} onClose={handleCloseAddElementMenu} />
    </Styles.Container>
  );
};
