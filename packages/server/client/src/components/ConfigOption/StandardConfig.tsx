import * as React from 'react';
import {
  WidgetProp,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
  ComponentConfig$Input,
  ComponentConfig$Select,
} from 'canvas-types';
import { ConfigOption } from 'components/ConfigOption/ConfigOption';

interface StandardConfigProps {
  widgetProp: WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget;
  config: ComponentConfig$Input | ComponentConfig$Select;
  onChange: (propKey: string, prop: WidgetProp) => any;
}

export const StandardConfig = ({
  widgetProp,
  config,
  onChange,
}: StandardConfigProps): JSX.Element => {
  const handleOnChange = (prop: WidgetProp) => {
    onChange(config.key, prop);
  };

  const handleModeChange = (m: 'static' | 'variable' | 'widget') => {
    const defaultProp = ((): WidgetProp => {
      switch (m) {
        case 'static':
          return {
            mode: 'static',
            type: config.type,
            value: config.defaultValue,
          };
        case 'variable':
          return {
            mode: 'variable',
            type: 'string',
            variableId: '',
          };
        case 'widget':
          return {
            mode: 'widget',
            widgetId: '',
            lookup: '',
          };
        default:
          throw Error();
      }
    })();
    handleOnChange(defaultProp);
  };

  return (
    <ConfigOption
      widgetProp={widgetProp}
      config={config}
      onChange={handleOnChange}
      onModeChange={handleModeChange}
    />
  );
};
