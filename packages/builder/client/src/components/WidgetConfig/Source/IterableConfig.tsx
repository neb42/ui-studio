import * as React from 'react';
import { useSelector } from 'react-redux';
import Input from '@faculty/adler-web-components/atoms/Input';
import Select from '@faculty/adler-web-components/atoms/Select';
import { WidgetProp$Iterable } from '@ui-studio/types';
import { getAvailableIteratorKeys } from 'selectors/element';

interface VariableConfigProps {
  widgetId: string;
  widgetProp: WidgetProp$Iterable;
  onChange: (value: WidgetProp$Iterable) => void;
}

export const IterableConfig = ({
  widgetId,
  widgetProp,
  onChange,
}: VariableConfigProps): JSX.Element => {
  if (widgetProp.mode !== 'iterable')
    throw Error(`Trying to render iterable config editor for ${widgetProp.mode} prop`);

  const iterables = useSelector(getAvailableIteratorKeys)(widgetId);

  const buildIterableWidgetProp = (
    _widgetId: string,
    propKey: string,
    lookup: string,
  ): WidgetProp$Iterable => {
    return {
      mode: 'iterable',
      widgetId: _widgetId,
      propKey,
      lookup,
      iterable: false,
    };
  };

  const handleWidgetChange = ({ value }: any) => {
    onChange(buildIterableWidgetProp(value as string, widgetProp.propKey, widgetProp.lookup));
  };

  const handlePropKeyChange = ({ value }: any) => {
    onChange(buildIterableWidgetProp(widgetProp.widgetId, value as string, widgetProp.lookup));
  };

  const handleLookupChange = (value: string) => {
    onChange(buildIterableWidgetProp(widgetProp.widgetId, widgetProp.propKey, value));
  };

  const widgetOptions = iterables.map((it) => ({ label: it.widgetName, value: it.widgetId }));
  const widgetValue = {
    value: widgetProp.widgetId,
    label: iterables.find((it) => it.widgetId === widgetProp.widgetId)?.widgetName,
  };

  const propKeyOptions =
    iterables
      .find((it) => it.widgetId === widgetProp.widgetId)
      ?.propKeys.map((k) => ({ label: k, value: k })) ?? [];
  const propKeyValue = { label: widgetProp.propKey, value: widgetProp.propKey };

  return (
    <>
      <Select
        label="Iterator widget"
        value={widgetValue}
        onChange={handleWidgetChange}
        options={widgetOptions}
      />
      <Select
        label="Iterator prop"
        value={propKeyValue}
        onChange={handlePropKeyChange}
        options={propKeyOptions}
      />
      <Input label="Property" onChange={handleLookupChange} value={widgetProp.lookup} />
    </>
  );
};
