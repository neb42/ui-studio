import * as React from 'react';
import { useSelector } from 'react-redux';
import { makeGetElementTree } from 'selectors/element';
import { Store } from 'types/store';

import * as Styles from './ElementTree.styles';

interface Props {}

export const ElementTree = ({}: Props): JSX.Element => {
  const getElementTree = React.useMemo(makeGetElementTree, []);
  const elementTree = useSelector((state: Store) => getElementTree(state, ''));
  return <Styles.Container />;
};
