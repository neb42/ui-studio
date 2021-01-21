import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { ClearSharp, ArrowDropDownSharp, ArrowDropUpSharp, AddSharp } from '@material-ui/icons';
import { ElementTreeNode, Element } from '@ui-builder/types';
import { Store } from 'types/store';
import { makeGetElementTree, makeGetSelectedElement } from 'selectors/element';
import { selectElement } from 'actions/element';
import { removeLayout } from 'actions/layout';
import { removeWidget } from 'actions/widget';
import { ElementIcon } from 'components/ElementIcon';
import { ElementTreeHeader } from 'components/ElementTreeHeader';
import { AddElementMenu } from 'components/AddElementMenu';

import * as Styles from './ElementTree.styles';

interface IElementTree {
  pageId: string;
}

interface ITreeItemLabel {
  element: Element;
  siblingCount: number;
  onClick: () => void;
  handleOpenAddElementMenu: (anchor: HTMLElement) => void;
}

const TreeItemLabel = ({
  element,
  siblingCount,
  onClick,
  handleOpenAddElementMenu,
}: ITreeItemLabel): JSX.Element => {
  const dispatch = useDispatch();
  const getSelectedElement = React.useMemo(makeGetSelectedElement, []);
  const selectedElement = useSelector(getSelectedElement);

  const handleOpenAddMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
    handleOpenAddElementMenu(event.currentTarget);

  const handleRemove = () => {
    if (element.type === 'layout') {
      dispatch(removeLayout(element));
    }

    if (element.type === 'widget') {
      dispatch(removeWidget(element));
    }
  };

  return (
    <Styles.TreeItemLabel onClick={onClick} active={element.id === selectedElement?.id}>
      <ElementIcon element={element} color="#000" />
      <span>{element.name}</span>
      <Styles.TreeItemActions
        selected={Boolean(selectedElement && selectedElement.id === element.id)}
      >
        {(element.type === 'page' || element.type === 'overlay') && (
          <>
            <div />
            <div />
            <div />
          </>
        )}
        {element.type !== 'widget' || element.hasChildren ? (
          <IconButton onClick={handleOpenAddMenu} size="small">
            <AddSharp />
          </IconButton>
        ) : (
          <div />
        )}
        {element.type !== 'page' && element.type !== 'overlay' && (
          <>
            <IconButton
              onClick={() => {}}
              size="small"
              disabled={element.position === siblingCount - 1}
            >
              <ArrowDropDownSharp />
            </IconButton>
            <IconButton onClick={() => {}} size="small" disabled={element.position === 0}>
              <ArrowDropUpSharp />
            </IconButton>
            <IconButton onClick={handleRemove} size="small">
              <ClearSharp />
            </IconButton>
          </>
        )}
      </Styles.TreeItemActions>
    </Styles.TreeItemLabel>
  );
};

interface ITreeNode {
  node: ElementTreeNode;
  siblingCount: number;
  depth: number;
  handleSelect: (name: string) => () => void;
  handleOpenAddElementMenu: (anchor: HTMLElement) => void;
}

const TreeNode = ({
  node,
  siblingCount,
  depth,
  handleSelect,
  handleOpenAddElementMenu,
}: ITreeNode): JSX.Element => (
  <>
    <TreeItemLabel
      element={node.element}
      siblingCount={siblingCount}
      onClick={handleSelect(node.id)}
      handleOpenAddElementMenu={handleOpenAddElementMenu}
    />
    <Styles.TreeNode depth={depth + 1}>
      {node.children
        .sort((a, b) => (a.position > b.position ? 1 : -1))
        .map((c) => (
          <TreeNode
            key={c.id}
            node={c}
            siblingCount={node.children.length}
            depth={depth + 1}
            handleSelect={handleSelect}
            handleOpenAddElementMenu={handleOpenAddElementMenu}
          />
        ))}
    </Styles.TreeNode>
  </>
);

export const ElementTree = ({ pageId }: IElementTree): JSX.Element | null => {
  const dispatch = useDispatch();
  const [addElementMenuAnchor, setAddElementMenuAnchor] = React.useState<HTMLElement | null>(null);
  const getElementTree = React.useMemo(makeGetElementTree, []);
  const elementTree = useSelector((state: Store) => getElementTree(state, pageId));

  const handleCloseAddElementMenu = () => setAddElementMenuAnchor(null);

  const handleSelect = (nodeId: string) => () => {
    dispatch(selectElement(nodeId));
  };

  if (!elementTree) return null;

  return (
    <Styles.Container>
      <ElementTreeHeader />
      <Styles.Tree>
        <TreeNode
          node={elementTree}
          siblingCount={1}
          depth={0}
          handleSelect={handleSelect}
          handleOpenAddElementMenu={setAddElementMenuAnchor}
        />
      </Styles.Tree>
      <AddElementMenu anchor={addElementMenuAnchor} onClose={handleCloseAddElementMenu} />
    </Styles.Container>
  );
};
