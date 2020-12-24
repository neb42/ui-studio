import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { AddSharp } from '@material-ui/icons';
import { Variable } from '@ui-builder/types';
import { selectVariable, addVariable } from 'actions/variable';
import { getVariables, getSelectedVariableId } from 'selectors/element';

import * as Styles from './VariableList.styles';

export const VariableList = () => {
  const dispatch = useDispatch();
  const selectedVariableId = useSelector(getSelectedVariableId);
  const variables: Variable[] = Object.values(useSelector(getVariables));

  const handleSelectVariable = (id: string) => () => dispatch(selectVariable(id));

  const handleAddVariable = () => dispatch(addVariable());

  return (
    <Styles.Container>
      <Styles.Header>
        Variables
        <IconButton onClick={handleAddVariable} size="small" style={{ color: '#fff' }}>
          <AddSharp />
        </IconButton>
      </Styles.Header>
      {variables.map((v) => (
        <Styles.VariableItem
          key={v.id}
          onClick={handleSelectVariable(v.id)}
          active={v.id === selectedVariableId}
        >
          <Styles.Name>{v.name}</Styles.Name>
        </Styles.VariableItem>
      ))}
    </Styles.Container>
  );
};
