import * as React from 'react';
import { useSelector } from 'react-redux';
import Input from '@faculty/adler-web-components/atoms/Input';
import Select from '@faculty/adler-web-components/atoms/Select';
import {
  ComponentConfig$Input,
  ComponentConfig$Select,
  WidgetProp,
  WidgetProp$Variable,
} from '@ui-builder/types';
import { getVariables } from 'selectors/element';

interface VariableConfigProps {
  widgetProp: WidgetProp;
  config: ComponentConfig$Input | ComponentConfig$Select;
  onChange: (value: WidgetProp) => void;
}

export const VariableConfig = ({
  widgetProp,
  config,
  onChange,
}: VariableConfigProps): JSX.Element => {
  if (widgetProp.mode !== 'variable')
    throw Error(`Trying to render variable config editor for ${widgetProp.mode} prop`);

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
      };

    return {
      mode: 'variable',
      type,
      variableId,
    };
  };

  const variables = Object.values(useSelector(getVariables)).filter(
    (v) => v.valueType === config.type || v.valueType === 'object',
  );

  const selectedVariableId = widgetProp.variableId;
  const selectedVariable = variables.find((v) => v.id === selectedVariableId);

  const handleIdChange = ({ value }: any) => {
    const newVariableId = value as string;
    const newVariable = variables.find((v) => v.id === newVariableId);
    if (newVariable === undefined) return;
    onChange(buildVariableWidgetProps(newVariableId, newVariable.valueType, ''));
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
            config.type !== 'object' && widgetProp.lookup.length === 0 ? 'Required' : undefined
          }
        />
      )}
    </>
  );
};
