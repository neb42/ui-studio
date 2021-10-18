import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import Select from '@faculty/adler-web-components/atoms/Select';
import { updateVariableName, updateVariableType } from 'actions/variable';
import { getSelectedVariable } from 'selectors/variable';
import { StaticVariableConfig } from 'components/Variables/StaticVariableConfig';
import { FunctionVariableConfig } from 'components/Variables/FunctionVariableConfig';
import { LookupVariableConfig } from 'components/Variables/LookupVariableConfig';

import * as Styles from './VariableConfig.styles';

const variableTypeOptions = [
  { value: 'static', label: 'Static' },
  { value: 'function', label: 'Function' },
  { value: 'lookup', label: 'Lookup' },
];

export const VariableConfig = () => {
  const dispatch = useDispatch();
  const selectedVariable = useSelector(getSelectedVariable);

  const handleOnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedVariable) {
      dispatch(updateVariableName(selectedVariable.id, event.target.value));
    }
  };

  const handleOnTypeChange = ({ value }: any) => {
    if (selectedVariable) {
      dispatch(updateVariableType(selectedVariable.id, value as 'static' | 'function'));
    }
  };

  if (!selectedVariable) return <div />;

  return (
    <Styles.Container>
      <TextField
        label="Name"
        value={selectedVariable.name}
        onChange={handleOnNameChange}
        error={selectedVariable.name.length === 0}
        helperText="Required"
      />
      <Select
        label="Type"
        value={variableTypeOptions.find((o) => o.value === selectedVariable?.type)}
        onChange={handleOnTypeChange}
        options={variableTypeOptions}
      />
      {selectedVariable?.type === 'static' && <StaticVariableConfig variable={selectedVariable} />}
      {selectedVariable?.type === 'function' && (
        <FunctionVariableConfig variable={selectedVariable} />
      )}
      {selectedVariable?.type === 'lookup' && <LookupVariableConfig variable={selectedVariable} />}
    </Styles.Container>
  );
};
