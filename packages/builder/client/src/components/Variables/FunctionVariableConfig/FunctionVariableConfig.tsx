import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { OpenAPIV3 } from 'openapi-types';
import Select from '@faculty/adler-web-components/atoms/Select';
import { FunctionVariable, FunctionVariableArg, Value$Static } from '@ui-studio/types';
import { getArgTypeLookUp, getFunctions } from 'selectors/configuration';
import { updateFunctionVariable } from 'actions/variable';
import { FunctionVariableArgConfig } from 'components/Variables/FunctionVariableArgConfig';
import { Button } from '@faculty/adler-web-components';
import { openFunctionConfigurationModal } from 'actions/modal';

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
        value as 'auto' | 'event',
        variable.args,
      ),
    );

  const handleFunctionIdChange = ({ value }: any) => {
    const functionId = value as { method: OpenAPIV3.HttpMethods; path: string };
    const staticArgTypeMap: {
      [argType in 'string' | 'number' | 'boolean']: Value$Static;
    } = {
      string: { mode: 'static', value: '' },
      number: { mode: 'static', value: 0 },
      boolean: { mode: 'static', value: true },
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

    dispatch(updateFunctionVariable(variable.id, functionId, variable.trigger, defaultArgs));
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
      <Button
        text="Configure function"
        onClick={handleOpenConfigureFunction}
        color={Button.colors.primary}
        style={Button.styles.outline}
        size={Button.sizes.medium}
      />
    </>
  );
};
