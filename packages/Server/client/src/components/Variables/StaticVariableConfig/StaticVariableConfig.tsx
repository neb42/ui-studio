import * as React from 'react';
import { StaticVariable } from '@ui-builder/types';
import { TextField, Select, MenuItem } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { updateStaticVariable } from 'actions/variable';

import * as Styles from './StaticVariableConfig.styles';

interface Props {
  variable: StaticVariable;
}

export const StaticVariableConfig = ({ variable }: Props) => {
  const dispatch = useDispatch();

  const handleValueTypeChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => {
    const v = event.target.value as 'string' | 'number' | 'boolean' | 'object';
    if (v === 'string') dispatch(updateStaticVariable(variable.id, 'string', ''));
    if (v === 'number') dispatch(updateStaticVariable(variable.id, 'number', 0));
    if (v === 'boolean') dispatch(updateStaticVariable(variable.id, 'boolean', true));
    if (v === 'object') dispatch(updateStaticVariable(variable.id, 'object', ''));
  };

  const handleStringValueChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateStaticVariable(variable.id, 'string', event.target.value as string));

  const handleNumberValueChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateStaticVariable(variable.id, 'number', Number(event.target.value)));

  const handleBooleanValueChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => dispatch(updateStaticVariable(variable.id, 'boolean', (event.target.value as 1 | 0) === 1));

  const handleObjectValueChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateStaticVariable(variable.id, 'object', event.target.value as string));

  return (
    <Styles.Container>
      <Styles.Type>
        <Select value={variable.valueType} onChange={handleValueTypeChange}>
          <MenuItem value="string">String</MenuItem>
          <MenuItem value="number">Number</MenuItem>
          <MenuItem value="boolean">Boolean</MenuItem>
          <MenuItem value="object">Object</MenuItem>
        </Select>
      </Styles.Type>
      <Styles.Value>
        {variable.valueType === 'string' && (
          <TextField
            id="value"
            label="Value"
            value={variable.value}
            onChange={handleStringValueChange}
          />
        )}
        {variable.valueType === 'number' && (
          <TextField
            id="value"
            label="Value"
            type="number"
            value={variable.value}
            onChange={handleNumberValueChange}
          />
        )}
        {variable.valueType === 'boolean' && (
          <Select value={variable.value ? 1 : 0} onChange={handleBooleanValueChange}>
            <MenuItem value={1}>True</MenuItem>
            <MenuItem value={0}>False</MenuItem>
          </Select>
        )}
        {variable.valueType === 'object' && (
          // TODO make multiline
          // TODO add validation
          <TextField
            id="value"
            label="Value"
            value={variable.value}
            onChange={handleObjectValueChange}
          />
        )}
      </Styles.Value>
    </Styles.Container>
  );
};
