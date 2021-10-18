import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FunctionVariable, LookupVariable } from '@ui-studio/types';
import { updateLookupVariable } from 'actions/variable';
import { VariableModel } from 'models/variable';
import { getOpenAPISchema } from 'selectors/configuration';
import { getVariables } from 'selectors/variable';

import { LookupVariableConfigComponent } from './LookupVariableConfig.component';

type Props = {
  variable: LookupVariable;
};

export const LookupVariableConfigContainer = ({ variable }: Props) => {
  const dispatch = useDispatch();

  const allVariables = useSelector(getVariables);
  const spec = useSelector(getOpenAPISchema);

  const availableVariables = Object.values(allVariables).filter(
    (v): v is FunctionVariable =>
      v.id !== variable.id &&
      v.type === 'function' &&
      VariableModel.getValueType(v, spec, allVariables) === 'object',
  );

  if (!variable || variable.type !== 'lookup') throw new Error();

  const handleVariableIdChange = (variableId: string) =>
    dispatch(updateLookupVariable(variable.id, { ...variable, variableId }));

  const handleLookupChange = (lookup: string) =>
    dispatch(updateLookupVariable(variable.id, { ...variable, lookup }));

  return (
    <LookupVariableConfigComponent
      variable={variable}
      availableVariables={availableVariables}
      onVariableIdChange={handleVariableIdChange}
      onLookupChange={handleLookupChange}
    />
  );
};
