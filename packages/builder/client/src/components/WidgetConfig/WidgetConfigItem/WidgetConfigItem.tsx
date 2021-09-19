import * as React from 'react';
import { useSelector } from 'react-redux';
import { WidgetProp, ComponentConfig, Mode } from '@ui-studio/types';
import { WidgetModel } from 'models/widget';
import { getAvailableIteratorKeys } from 'selectors/element';
import { ValueConfig } from 'components/ValueConfig';

import * as Styles from './WidgetConfigItem.styles';

interface WidgetConfigProps {
  widgetId: string;
  rootType: 'page' | 'customComponent';
  widgetProp: WidgetProp;
  config: ComponentConfig;
  onChange: (prop: WidgetProp) => any;
}

export const WidgetConfigItem = ({
  widgetId,
  rootType,
  widgetProp,
  config,
  onChange,
}: WidgetConfigProps): JSX.Element => {
  const hasIterableParent = useSelector(getAvailableIteratorKeys)(widgetId).length > 0;

  const handleModeChange = (mode: Mode) => {
    const defaultProp = WidgetModel.getDefaultProp(mode, config, widgetProp);
    onChange(defaultProp);
  };

  const handlePropChange = (prop: WidgetProp) => onChange(prop);

  const modeOptions = ((): Mode[] => {
    const modes: Mode[] = ['static', 'variable'];

    if (config.schema.type === 'array' || config.schema.type === 'object') modes.push('form');
    else modes.push('widget');

    if (hasIterableParent) modes.push('iterable');

    if (rootType === 'customComponent') modes.push('customComponentConfig');

    return modes;
  })();

  const mode = (() => {
    if (widgetProp.mode === 'complex' || widgetProp.mode === 'list') return 'form';
    return widgetProp.mode;
  })();

  return (
    <ValueConfig
      name={config.label}
      schema={config.schema}
      defaultValue={config.defaultValue}
      mode={mode}
      value={widgetProp}
      modeOptions={modeOptions}
      handleModeChange={handleModeChange}
      handleValueChange={handlePropChange}
    />
  );
};
