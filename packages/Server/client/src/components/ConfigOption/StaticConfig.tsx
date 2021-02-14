import * as React from 'react';
import Input from '@faculty/adler-web-components/atoms/Input';
import Select from '@faculty/adler-web-components/atoms/Select';
import Checkbox from '@faculty/adler-web-components/atoms/Checkbox';
import {
  ComponentConfig$Input,
  ComponentConfig$Select,
  WidgetProp,
  WidgetProp$Static,
} from '@ui-builder/types';

interface StaticConfigProps {
  widgetProp: WidgetProp;
  config: ComponentConfig$Input | ComponentConfig$Select;
  onChange: (value: WidgetProp) => void;
}

export const StaticConfig = ({ widgetProp, config, onChange }: StaticConfigProps): JSX.Element => {
  if (widgetProp.mode !== 'static')
    throw Error(`Trying to render static config editor for ${widgetProp.mode} prop`);

  const buildStaticWidgetProp = (v: string | number | boolean): WidgetProp$Static => {
    switch (config.type) {
      case 'string':
        return { mode: 'static', type: 'string', value: v.toString() };
      case 'number':
        return { mode: 'static', type: 'number', value: Number(v) };
      case 'boolean':
        return { mode: 'static', type: 'boolean', value: Boolean(v) };
      case 'object':
        return { mode: 'static', type: 'object', value: v.toString() };
      default:
        throw Error();
    }
  };

  const handleInputOnChange = (value: string) => {
    onChange(buildStaticWidgetProp(value));
  };

  const handleSelectOnChange = ({ value }: any) => {
    onChange(buildStaticWidgetProp(value as string));
  };

  const handleCheckboxOnChange = (value: boolean) => {
    onChange(buildStaticWidgetProp(value));
  };

  switch (config.component) {
    case 'input':
      switch (config.type) {
        case 'string':
        case 'object':
        case 'number': {
          if (typeof widgetProp.value === 'boolean') throw Error();
          return <Input label="value" onChange={handleInputOnChange} value={widgetProp.value} />;
        }
        case 'boolean':
          if (typeof widgetProp.value !== 'boolean') throw Error();
          return (
            <Checkbox checked={widgetProp.value} onChange={handleCheckboxOnChange} controlled>
              {config.label}
            </Checkbox>
          );
        default:
          throw Error();
      }
    case 'select': {
      const v = config.options.find((o) => o.key === widgetProp.value);
      return (
        <Select
          label="Value"
          value={v ? { value: v.key, label: v.label } : null}
          onChange={handleSelectOnChange}
          options={config.options.map((o) => ({ value: o.key, label: o.label }))}
        />
      );
    }
    // case 'checkbox':
    // case 'slider':
    // case 'multislider':
    default:
      return <div />;
  }
};
