import * as React from 'react';
import {
  WidgetProp,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
  ComponentConfig,
  Mode,
} from 'canvas-types';
import { ConfigOption } from 'components/ConfigOption/ConfigOption';
import { WidgetModel } from 'models/widget';

interface StandardConfigProps {
  widgetProp: WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget;
  config: ComponentConfig;
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

  const handleModeChange = (m: Mode) => {
    const defaultProp = WidgetModel.getDefaultProp(m, config, widgetProp);
    handleOnChange(defaultProp);
  };

  const modeOptions = ((): Mode[] => {
    if (config.list) return ['list', 'static', 'variable'];
    if (config.component === 'complex') return ['complex', 'static', 'variable'];
    return ['static', 'variable', 'widget'];
  })();

  return (
    <ConfigOption
      widgetProp={widgetProp}
      config={config}
      onChange={handleOnChange}
      onModeChange={handleModeChange}
      modeOptions={modeOptions}
    />
  );
};
