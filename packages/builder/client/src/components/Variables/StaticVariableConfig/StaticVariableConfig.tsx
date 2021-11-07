import * as React from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { StaticVariable } from '@ui-studio/types';
import { updateStaticVariable } from 'actions/variable';

const valueTypeOptions = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
];

const booleanOptions = [
  { value: 1, label: 'True' },
  { value: 0, label: 'False' },
];

interface Props {
  variable: StaticVariable;
}

export const StaticVariableConfig = ({ variable }: Props) => {
  const dispatch = useDispatch();

  const handleValueTypeChange = (event: SelectChangeEvent<'string' | 'number' | 'boolean'>) => {
    const v = event.target.value as 'string' | 'number' | 'boolean';
    if (v === 'string') dispatch(updateStaticVariable(variable.id, 'string', ''));
    if (v === 'number') dispatch(updateStaticVariable(variable.id, 'number', 0));
    if (v === 'boolean') dispatch(updateStaticVariable(variable.id, 'boolean', true));
  };

  const handleStringValueChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateStaticVariable(variable.id, 'string', event.target.value));

  const handleNumberValueChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateStaticVariable(variable.id, 'number', Number(event.target.value)));

  const handleBooleanValueChange = (event: SelectChangeEvent<number>) =>
    dispatch(updateStaticVariable(variable.id, 'boolean', Boolean(event.target.value as number)));

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Value type</InputLabel>
        <Select value={variable.valueType} label="Value type" onChange={handleValueTypeChange}>
          {valueTypeOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {variable.valueType === 'string' && (
        <TextField label="Value" value={variable.value} onChange={handleStringValueChange} />
      )}
      {variable.valueType === 'number' && (
        <TextField
          label="Value"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={variable.value}
          onChange={handleNumberValueChange}
        />
      )}
      {variable.valueType === 'boolean' && (
        <FormControl fullWidth>
          <Select value={variable.value ? 1 : 0} onChange={handleBooleanValueChange}>
            {booleanOptions.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );
};
