import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { ClearSharp, ArrowDropDownSharp, ArrowDropUpSharp, AddSharp } from '@material-ui/icons';
import { ElementTreeNode, Element } from '@ui-builder/types';
import { Store } from 'types/store';
import { makeGetElementTree, makeGetSelectedElement } from 'selectors/element';
import { selectElement, toggleAddElementModal } from 'actions/element';
import { removeLayout } from 'actions/layout';
import { removeWidget } from 'actions/widget';
import { ElementIcon } from 'components/ElementIcon';

import * as Styles from './ElementTree.styles';

interface IElementTree {
  pageName: string;
}

interface ITreeItemLabel {
  element: Element;
  siblingCount: number;
  onClick: () => void;
}

interface ITreeNode {
  node: ElementTreeNode;
  siblingCount: number;
  depth: number;
  handleSelect: (name: string) => () => void;
}

const TreeItemLabel = ({ element, siblingCount, onClick }: ITreeItemLabel): JSX.Element => {
  const dispatch = useDispatch();
  const getSelectedElement = React.useMemo(makeGetSelectedElement, []);
  const selectedElement = useSelector(getSelectedElement);

  const handleAddClick = () => dispatch(toggleAddElementModal());

  const handleRemove = () => {
    if (element.type === 'layout') {
      dispatch(removeLayout(element.name));
    }

    if (element.type === 'widget') {
      dispatch(removeWidget(element.name));
    }
  };

  return (
    <Styles.TreeItemLabel onClick={onClick} active={element.name === selectedElement?.name}>
      <ElementIcon element={element} color="#000" />
      <span>{element.name}</span>
      <Styles.TreeItemActions
        selected={Boolean(selectedElement && selectedElement.name === element.name)}
      >
        {(element.type === 'page' || element.type === 'overlay') && (
          <>
            <div />
            <div />
            <div />
          </>
        )}
        {element.type !== 'widget' ? (
          <IconButton onClick={handleAddClick} size="small">
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

const TreeNode = ({ node, siblingCount, depth, handleSelect }: ITreeNode): JSX.Element => (
  <>
    <TreeItemLabel
      element={node.element}
      siblingCount={siblingCount}
      onClick={handleSelect(node.name)}
    />
    <Styles.TreeNode depth={depth + 1}>
      {node.children
        .sort((a, b) => (a.position > b.position ? 1 : -1))
        .map((c) => (
          <TreeNode
            key={c.name}
            node={c}
            siblingCount={node.children.length}
            depth={depth + 1}
            handleSelect={handleSelect}
          />
        ))}
    </Styles.TreeNode>
  </>
);

export const ElementTree = ({ pageName }: IElementTree): JSX.Element | null => {
  const dispatch = useDispatch();
  const getElementTree = React.useMemo(makeGetElementTree, []);
  const elementTree = useSelector((state: Store) => getElementTree(state, pageName));

  const handleSelect = (nodeId: string) => () => {
    dispatch(selectElement(nodeId));
  };

  if (!elementTree) return null;

  return (
    <Styles.Container>
      <Styles.Header>Element tree</Styles.Header>
      <Styles.Tree>
        <TreeNode node={elementTree} siblingCount={1} depth={0} handleSelect={handleSelect} />
      </Styles.Tree>
    </Styles.Container>
  );
};
