import * as React from 'react';
import Tree, {
  RenderItemParams,
  TreeItem,
  TreeSourcePosition,
  TreeDestinationPosition,
  ItemId,
} from '@atlaskit/tree';
import { IconButton } from '@material-ui/core';
import { ClearSharp, AddSharp } from '@material-ui/icons';
import { Widget, Element } from '@ui-studio/types';

import { ElementIcon } from 'components/ElementIcon';
import { ElementTreeHeader } from 'components/ElementTreeHeader';
import { AddElementMenu } from 'components/AddElementMenu';

import * as Styles from './ElementTree.styles';

interface ITreeItemLabel {
  selectedElement: Element | null;
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

type Props = {
  rootId: string;
  selectedElement: Element | null;
  tree: Record<string, TreeItem>;
  onSelect: (nodeId: string) => any;
  onHover: (nodeId: string | null) => any;
  onRemove: (widget: Widget) => any;
  onDragStart: (id: string) => any;
  onDragEnd: (source: TreeSourcePosition, destination?: TreeDestinationPosition) => any;
};

export const ElementTreeComponent = ({
  rootId,
  selectedElement,
  tree,
  onSelect,
  onHover,
  onRemove,
  onDragStart,
  onDragEnd,
}: Props): JSX.Element | null => {
  const [addElementMenuAnchor, setAddElementMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [collapseMap, setCollapseMap] = React.useState<{ [key: string]: boolean }>({});

  const handleCloseAddElementMenu = () => setAddElementMenuAnchor(null);

  const handleSelect = (nodeId: string) => () => {
    onSelect(nodeId);
  };

  const handleMouseEnter = (nodeId: string) => () => {
    onHover(nodeId);
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  const handleOnDragStart = (id: ItemId) => {
    onDragStart(id.toString());
  };

  const handleOnDragEnd = (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
    onDragEnd(source, destination);
  };

  const handleRemove = (widget: Widget) => {
    onRemove(widget);
  };

  const handleExpand = (id: string | number) => {
    setCollapseMap({
      ...collapseMap,
      [id.toString()]: false,
    });
  };

  const handleCollapse = (id: string | number) => {
    if (tree[id.toString()].children.length === 0) return;
    setCollapseMap({
      ...collapseMap,
      [id.toString()]: true,
    });
  };

  if (!tree) return null;

  const treeWithExpanded: Record<string, TreeItem> = Object.keys(tree).reduce((acc, cur) => {
    const expanded = cur in collapseMap ? !collapseMap[cur] : true;
    return {
      ...acc,
      [cur]: {
        ...tree[cur],
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
                children: [rootId],
              },
              ...treeWithExpanded,
            },
          }}
          renderItem={ItemTreeLabel}
          onDragStart={handleOnDragStart}
          onDragEnd={handleOnDragEnd}
          onCollapse={handleCollapse}
          onExpand={handleExpand}
          offsetPerLevel={8}
          isDragEnabled={(id) => id.toString() !== rootId}
          isNestingEnabled
        />
      </Styles.Tree>
      <AddElementMenu anchor={addElementMenuAnchor} onClose={handleCloseAddElementMenu} />
    </Styles.Container>
  );
};
