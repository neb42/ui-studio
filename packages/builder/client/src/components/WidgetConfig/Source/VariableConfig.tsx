import * as React from 'react';
import { OpenAPIV3 } from 'openapi-types';
import { useSelector } from 'react-redux';
import Input from '@faculty/adler-web-components/atoms/Input';
import Select from '@faculty/adler-web-components/atoms/Select';
import {
  ComponentConfig,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
} from '@ui-studio/types';
import { getVariables } from 'selectors/variable';
import { Store } from 'types/store';
import { VariableModel } from 'models/variable';

interface VariableConfigProps {
  widgetProp: WidgetProp$Variable;
  config: ComponentConfig;
  onChange: (value: WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget) => void;
}

export const VariableConfig = ({
  widgetProp,
  config,
  onChange,
}: VariableConfigProps): JSX.Element => {
  if (widgetProp.mode !== 'variable')
    throw Error(`Trying to render variable config editor for ${widgetProp.mode} prop`);

  const openAPISchema = useSelector<Store, OpenAPIV3.Document>(
    (state) => state.configuration.openAPISchema,
  );

  const buildVariableWidgetProps = (
    variableId: string,
    type: 'string' | 'number' | 'boolean' | 'object',
    lookup?: string,
  ): WidgetProp$Variable => {
    if (type === 'object')
      return {
        mode: 'variable',
        type: 'object',
        variableId,
        lookup: lookup || '',
        iterable: Boolean(config.iterable),
      };

    return {
      mode: 'variable',
      type,
      variableId,
      iterable: false,
    };
  };

  const variables = Object.values(useSelector(getVariables)).filter((v) => {
    const valueType = VariableModel.getValueType(v, openAPISchema);
    if (config.list || config.component === 'complex') return valueType === 'object';
    return valueType === config.type || valueType === 'object';
  });

  const selectedVariableId = widgetProp.variableId;
  const selectedVariable = variables.find((v) => v.id === selectedVariableId);

  const handleIdChange = ({ value }: any) => {
    const newVariableId = value as string;
    const newVariable = variables.find((v) => v.id === newVariableId);
    if (newVariable === undefined) return;
    const valueType = VariableModel.getValueType(newVariable, openAPISchema);
    onChange(buildVariableWidgetProps(newVariableId, valueType, ''));
  };

  const handleLookupChange = (value: string) => {
    onChange(buildVariableWidgetProps(selectedVariableId, 'object', value));
  };

  return (
    <>
      <Select
        label="Variable"
        value={
          selectedVariable ? { value: selectedVariable.id, label: selectedVariable.name } : null
        }
        onChange={handleIdChange}
        options={variables.map((v) => ({ value: v.id, label: v.name }))}
      />
      {widgetProp.type === 'object' && (
        <Input
          label="Object property"
          onChange={handleLookupChange}
          value={widgetProp.lookup}
          // TODO add validation function
          error={
            (config.list || config.component === 'complex' || config.type !== 'object') &&
            widgetProp.lookup.length === 0
              ? 'Required'
              : undefined
          }
        />
      )}
    </>
  );
};
