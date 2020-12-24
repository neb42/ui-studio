import * as React from 'react';
import { VariableList } from 'components/Variables/VariableList';
import { VariableConfig } from 'components/Variables/VariableConfig';

import * as Styles from './Variables.styles';

export const Variables = () => {
  return (
    <Styles.Container>
      <VariableList />
      <VariableConfig />
    </Styles.Container>
  );
};
