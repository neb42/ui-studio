import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import { IconButton } from '@material-ui/core';
import {
  ExpandMoreSharp,
  ChevronRightSharp,
  ClearSharp,
  ArrowDropDownSharp,
  ArrowDropUpSharp,
  AddSharp,
} from '@material-ui/icons';
import TreeItem from '@material-ui/lab/TreeItem';
import { ElementTreeNode, Element } from '@ui-builder/types';
import { Store } from 'types/store';
import { makeGetElementTree, makeGetSelectedElement } from 'selectors/element';
import { selectElement } from 'actions/element';
import { removeLayout } from 'actions/layout';
import { removeWidget } from 'actions/widget';
import { ElementIcon } from 'components/ElementIcon';

import { AddElementButtons } from '../DEBUG/AddElementButtons';

import * as Styles from './ElementTree.styles';

interface IElementTree {
  pageName: string;
}

interface ITreeItemLabel {
  element: Element;
  siblingCount: number;
}

interface ITreeNode {
  node: ElementTreeNode;
  siblingCount: number;
}

const TreeItemLabel = ({ element, siblingCount }: ITreeItemLabel): JSX.Element => {
  const dispatch = useDispatch();
  const getSelectedElement = React.useMemo(makeGetSelectedElement, []);
  const selectedElement = useSelector(getSelectedElement);

  const handleRemove = () => {
    if (element.type === 'layout') {
      dispatch(removeLayout(element.name));
    }

    if (element.type === 'widget') {
      dispatch(removeWidget(element.name));
    }
  };

  return (
    <Styles.TreeItemLabel>
      <ElementIcon element={element} color="#000" />
      <span>{element.name}</span>
      <Styles.TreeItemActions
        selected={Boolean(selectedElement && selectedElement.name === element.name)}
      >
        {element.type === 'page' && (
          <>
            <div />
            <div />
            <div />
          </>
        )}
        {element.type !== 'widget' ? (
          <IconButton onClick={() => {}} size="small">
            <AddSharp />
          </IconButton>
        ) : (
          <div />
        )}
        {element.type !== 'page' && (
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

const TreeNode = ({ node, siblingCount }: ITreeNode): JSX.Element => (
  <TreeItem
    nodeId={node.name}
    label={<TreeItemLabel element={node.element} siblingCount={siblingCount} />}
  >
    {node.children
      .sort((a, b) => (a.position > b.position ? 1 : -1))
      .map((c) => (
        <TreeNode key={c.name} node={c} siblingCount={node.children.length} />
      ))}
  </TreeItem>
);

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export const ElementTree = ({ pageName }: IElementTree): JSX.Element | null => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const getElementTree = React.useMemo(makeGetElementTree, []);
  const elementTree = useSelector((state: Store) => getElementTree(state, pageName));

  const handleSelect = (event: React.ChangeEvent<any>, nodeId: string) => {
    dispatch(selectElement(nodeId));
  };

  if (!elementTree) return null;

  return (
    <Styles.Container>
      <AddElementButtons />
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreSharp />}
        defaultExpandIcon={<ChevronRightSharp />}
        onNodeSelect={handleSelect}
      >
        <TreeNode node={elementTree} siblingCount={1} />
      </TreeView>
    </Styles.Container>
  );
};
