import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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

  const handleOnTypeChange = (event: SelectChangeEvent) => {
    if (selectedVariable) {
      dispatch(
        updateVariableType(selectedVariable.id, event.target.value as 'static' | 'function'),
      );
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
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select value={selectedVariable.type} label="Type" onChange={handleOnTypeChange}>
          {variableTypeOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedVariable?.type === 'static' && <StaticVariableConfig variable={selectedVariable} />}
      {selectedVariable?.type === 'function' && (
        <FunctionVariableConfig variable={selectedVariable} />
      )}
      {selectedVariable?.type === 'lookup' && <LookupVariableConfig variable={selectedVariable} />}
    </Styles.Container>
  );
};
