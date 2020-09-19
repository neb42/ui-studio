import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { makeGetElementTree } from 'selectors/element';
import { Store } from 'types/store';
import { ElementTreeNode } from 'types/element';
import { selectElement } from 'actions/element';

import * as Styles from './ElementTree.styles';

interface Props {
  pageName: string;
}

const TreeNode = ({ node }: { node: ElementTreeNode }): JSX.Element => (
  <TreeItem nodeId={node.id} label={node.name}>
    {node.children.map((c) => (
      <TreeNode key={c.name} node={c} />
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

export const ElementTree = ({ pageName }: Props): JSX.Element | null => {
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
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        onNodeSelect={handleSelect}
      >
        <TreeNode node={elementTree} />
      </TreeView>
    </Styles.Container>
  );
};
