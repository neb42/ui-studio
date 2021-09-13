import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { OpenAPIV3 } from 'openapi-types';
import Select from '@faculty/adler-web-components/atoms/Select';
import {
  FunctionVariable,
  FunctionVariableArg,
  FunctionVariable$StaticArg,
} from '@ui-studio/types';
import { getArgTypeLookUp, getFunctions } from 'selectors/configuration';
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
  const functions = useSelector(getFunctions);
  const argTypeLookUp = useSelector(getArgTypeLookUp);

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
    const functionId = value as { method: OpenAPIV3.HttpMethods; path: string };
    const staticArgTypeMap: {
      [argType in 'string' | 'number' | 'boolean']: FunctionVariable$StaticArg;
    } = {
      string: { type: 'static', valueType: 'string', value: '' },
      number: { type: 'static', valueType: 'number', value: 0 },
      boolean: { type: 'static', valueType: 'boolean', value: true },
    };
    const defaultArgs = {
      path: Object.keys(argTypeLookUp.path[functionId.path][functionId.method]).reduce(
        (acc, cur) => {
          return {
            ...acc,
            [cur]: staticArgTypeMap[argTypeLookUp.path[functionId.path][functionId.method][cur]],
          };
        },
        {},
      ),
      query: Object.keys(argTypeLookUp.query[functionId.path][functionId.method]).reduce(
        (acc, cur) => {
          return {
            ...acc,
            [cur]: staticArgTypeMap[argTypeLookUp.query[functionId.path][functionId.method][cur]],
          };
        },
        {},
      ),
      body: Object.keys(argTypeLookUp.body[functionId.path][functionId.method]).reduce(
        (acc, cur) => {
          return {
            ...acc,
            [cur]: staticArgTypeMap[argTypeLookUp.body[functionId.path][functionId.method][cur]],
          };
        },
        {},
      ),
    };

    dispatch(
      updateFunctionVariable(
        variable.id,
        functionId,
        // func.returnType,
        'string',
        variable.trigger,
        defaultArgs,
      ),
    );
  };

  // const handleArgChange = (idx: number) => (argName: string, arg: FunctionVariableArg) => {
  //   const args = [...variable.args];
  //   args[idx] = arg;
  //   dispatch(
  //     updateFunctionVariable(
  //       variable.id,
  //       variable.functionId,
  //       variable.valueType,
  //       variable.trigger,
  //       args,
  //     ),
  //   );
  // };

  const functionIdOptions = functions.map((f) => ({
    value: f,
    label: `${f.method.toUpperCase()} ${f.path}`,
  }));

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
        value={functionIdOptions.find(
          (o) =>
            o.value.method === variable.functionId.method &&
            o.value.path === variable.functionId.path,
        )}
        onChange={handleFunctionIdChange}
        options={functionIdOptions}
      />
    </>
  );
};
