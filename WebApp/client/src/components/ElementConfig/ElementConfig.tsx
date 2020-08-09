import * as React from 'react';
import { useSelector } from 'react-redux';
import { makeGetSelectedElement } from 'selectors/element';

import * as Styles from './ElementConfig.styles';

interface Props {}

export const ElementConfig = ({}: Props): JSX.Element => {
  const getSelectedElement = React.useMemo(makeGetSelectedElement, []);
  const selectedElement = useSelector(getSelectedElement);

  if (selectedElement === null) {
    return <Styles.Container>No element selected</Styles.Container>;
  }

  return <Styles.Container>{selectedElement.name}</Styles.Container>;
};
