import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from '@faculty/adler-web-components/atoms/Select';
import {
  FunctionVariable,
  FunctionVariableArg,
  FunctionVariable$StaticArg,
} from '@ui-builder/types';
import { makeGetFunctions } from 'selectors/element';
import { updateFunctionVariable } from 'actions/variable';
import { FunctionVariableArgConfig } from 'components/Variables/FunctionVariableArgConfig';

import * as Styles from './FunctionVariableConfig.styles';

const triggerOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'event', label: 'Event' },
];

interface Props {
  variable: FunctionVariable;
}

export const FunctionVariableConfig = ({ variable }: Props) => {
  const dispatch = useDispatch();
  const functions = useSelector(React.useMemo(makeGetFunctions, []));

  const selectedFunction = functions.find((f) => f.name === variable.functionId);

  const handleTriggerChange = ({ value }: any) =>
    dispatch(
      updateFunctionVariable(
        variable.id,
        variable.functionId,
        variable.valueType,
        value as 'auto' | 'event',
        variable.args,
      ),
    );

  const handleFunctionIdChange = ({ value }: any) => {
    const functionId = value as string;
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

  const functionIdOptions = functions.map((f) => ({ value: f.name, label: f.name }));

  return (
    <>
      <Select
        label="Trigger"
        value={triggerOptions.find((o) => o.value === variable.trigger)}
        onChange={handleTriggerChange}
        options={triggerOptions}
      />
      <Select
        label="Function"
        value={functionIdOptions.find((o) => o.value === variable.functionId)}
        onChange={handleFunctionIdChange}
        options={functionIdOptions}
      />
      {selectedFunction && (
        <Styles.Args>
          <Styles.ArgsHeader>Function arguments</Styles.ArgsHeader>
          {selectedFunction.args.map((a, i) => (
            <FunctionVariableArgConfig
              key={a.name}
              onChange={handleArgChange(i)}
              name={a.name}
              valueType={a.type}
              arg={variable.args[i]}
            />
          ))}
        </Styles.Args>
      )}
    </>
  );
};
