import * as React from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FunctionVariable, LookupVariable } from '@ui-studio/types';

type Props = {
  variable: LookupVariable;
  availableVariables: FunctionVariable[];
  onVariableIdChange: (variableId: string) => any;
  onLookupChange: (lookup: string) => any;
};

export const LookupVariableConfigComponent = ({
  variable,
  availableVariables,
  onVariableIdChange,
  onLookupChange,
}: Props) => {
  const options = availableVariables.map((v) => ({ value: v.id, label: v.name }));

  const handleLookupChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onLookupChange(event.target.value);

  const handleVariableChange = (event: SelectChangeEvent) => onVariableIdChange(event.target.value as string);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Variable</InputLabel>
        <Select label="Variable" value={variable.variableId} onChange={handleVariableChange}>
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField label="Lookup" value={variable.lookup} onChange={handleLookupChange} />
    </>
  );
};
