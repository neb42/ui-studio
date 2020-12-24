import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select, MenuItem } from '@material-ui/core';
import {
  FunctionVariable,
  FunctionVariableArg,
  FunctionVariable$StaticArg,
} from '@ui-builder/types';
import { makeGetFunctions } from 'selectors/element';
import { updateFunctionVariable } from 'actions/variable';

import { FunctionVariableArgConfig } from '../FunctionVariableArgConfig';

import * as Styles from './FunctionVariableConfig.styles';

interface Props {
  variable: FunctionVariable;
}

export const FunctionVariableConfig = ({ variable }: Props) => {
  const dispatch = useDispatch();
  const functions = useSelector(React.useMemo(makeGetFunctions, []));

  const selectedFunction = functions.find((f) => f.name === variable.functionId);

  const handleTriggerChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) =>
    dispatch(
      updateFunctionVariable(
        variable.id,
        variable.functionId,
        variable.valueType,
        event.target.value as 'auto' | 'event',
        variable.args,
      ),
    );

  const handleFunctionIdChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => {
    const functionId = event.target.value as string;
    const func = functions.find((f) => f.name === functionId);
    if (!func) return;
    const defaultArgs: FunctionVariable$StaticArg[] = func.args.map((a) => {
      if (a.type === 'string')
        return {
          type: 'static',
          valueType: 'string',
          value: '',
        };
      if (a.type === 'number')
        return {
          type: 'static',
          valueType: 'number',
          value: 0,
        };
      if (a.type === 'boolean')
        return {
          type: 'static',
          valueType: 'boolean',
          value: true,
        };
      throw Error('Invalid type');
    });
    dispatch(
      updateFunctionVariable(
        variable.id,
        functionId,
        func.returnType,
        variable.trigger,
        defaultArgs,
      ),
    );
  };

  const handleArgChange = (idx: number) => (argName: string, arg: FunctionVariableArg) => {
    const args = [...variable.args];
    args[idx] = arg;
    dispatch(
      updateFunctionVariable(
        variable.id,
        variable.functionId,
        variable.valueType,
        variable.trigger,
        args,
      ),
    );
  };

  return (
    <Styles.Container>
      <Select value={variable.trigger} onChange={handleTriggerChange}>
        <MenuItem value="auto">Auto</MenuItem>
        <MenuItem value="event">Event</MenuItem>
      </Select>
      <Select value={variable.functionId} onChange={handleFunctionIdChange}>
        {functions.map((f) => (
          <MenuItem key={f.name} value={f.name}>
            {f.name}
          </MenuItem>
        ))}
      </Select>
      {selectedFunction &&
        selectedFunction.args.map((a, i) => (
          <FunctionVariableArgConfig
            key={a.name}
            onChange={handleArgChange(i)}
            name={a.name}
            valueType={a.type}
            arg={variable.args[i]}
          />
        ))}
    </Styles.Container>
  );
};
