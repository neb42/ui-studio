import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { OpenAPIV3 } from 'openapi-types';
import { FunctionVariable } from '@ui-studio/types';
import { getArgTypeLookUp, getFunctions } from 'selectors/configuration';
import { updateFunctionVariable } from 'actions/variable';
import { openFunctionConfigurationModal } from 'actions/modal';
import { EventModel } from 'models/event';

const triggerOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'event', label: 'Event' },
];

interface Props {
  variable: FunctionVariable;
}

export const FunctionVariableConfig = ({ variable }: Props) => {
  const dispatch = useDispatch();
  const functions = useSelector(getFunctions);
  const argTypeLookUp = useSelector(getArgTypeLookUp);

  const handleTriggerChange = (event: SelectChangeEvent) =>
    dispatch(
      updateFunctionVariable(
        variable.id,
        variable.functionId,
        event.target.value as 'auto' | 'event',
        variable.args,
      ),
    );

  const handleFunctionIdChange = (event: SelectChangeEvent) => {
    const [path, method] = (event.target.value as string).split(' ');
    const defaultArgs = EventModel.getDefaultFunctionArgs(
      argTypeLookUp,
      path,
      method as OpenAPIV3.HttpMethods,
    );
    dispatch(
      updateFunctionVariable(
        variable.id,
        { path, method: method as OpenAPIV3.HttpMethods },
        variable.trigger,
        defaultArgs,
      ),
    );
  };

  const functionIdOptions = functions.map((f) => ({
    value: f,
    label: `${f.method.toUpperCase()} ${f.path}`,
  }));

  const handleOpenConfigureFunction = () =>
    dispatch(
      openFunctionConfigurationModal(
        variable.id,
        variable.functionId.path,
        variable.functionId.method,
      ),
    );

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Trigger</InputLabel>
        <Select value={variable.trigger} label="Trigger" onChange={handleTriggerChange}>
          {triggerOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Function</InputLabel>
        <Select
          value={`${variable.functionId.path} ${variable.functionId.method}`}
          label="Function"
          onChange={handleFunctionIdChange}
        >
          {functionIdOptions.map((o) => (
            <MenuItem
              key={`${o.value.path}-${o.value.method}`}
              value={`${o.value.path} ${o.value.method}`}
            >
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={handleOpenConfigureFunction}>
        Configure function
      </Button>
    </>
  );
};
