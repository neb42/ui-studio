import * as React from 'react';
import { useDispatch } from 'react-redux';
import Button from '@faculty/adler-web-components/atoms/Button';
import { addVariable } from 'actions/variable';
import { VariableList } from 'components/Variables/VariableList';
import { VariableConfig } from 'components/Variables/VariableConfig';

import * as Styles from './Variables.styles';

export const Variables = () => {
  const dispatch = useDispatch();

  const handleAddVariable = () => dispatch(addVariable());

  return (
    <Styles.Container>
      <Styles.Header>
        <Styles.HeaderTitle>Variables</Styles.HeaderTitle>
        <Button
          icon="add"
          color={Button.colors.secondary}
          style={Button.styles.naked}
          size={Button.sizes.medium}
          onClick={handleAddVariable}
        />
      </Styles.Header>
      <VariableList />
      <VariableConfig />
    </Styles.Container>
  );
};
