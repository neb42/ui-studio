import * as React from 'react';
import { useSelector } from 'react-redux';
import Select from '@faculty/adler-web-components/atoms/Select';
import {
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
  ComponentConfig,
  WidgetProp$CustomComponentConfig,
} from '@ui-studio/types';
import { getSelectedRootElement } from 'selectors/tree';

interface WidgetConfigProps {
  config: ComponentConfig;
  widgetProp: WidgetProp$CustomComponentConfig;
  onChange: (
    prop:
      | WidgetProp$Static
      | WidgetProp$Variable
      | WidgetProp$Widget
      | WidgetProp$CustomComponentConfig,
  ) => void;
}

export const CustomComponentConfig = ({
  config,
  widgetProp,
  onChange,
}: WidgetConfigProps): JSX.Element => {
  const customComponent = useSelector(getSelectedRootElement);

  if (widgetProp.mode !== 'customComponentConfig')
    throw new Error(`Trying to render custom component config editor for ${widgetProp.mode} prop`);

  if (
    !customComponent ||
    customComponent.type !== 'customComponent' ||
    config.component === 'complex'
  )
    throw new Error();

  const buildProp = (configKey: string): WidgetProp$CustomComponentConfig => ({
    mode: 'customComponentConfig',
    configKey,
  });

  const handleChange = ({ value }: any) => {
    onChange(buildProp(value as string));
  };

  const options =
    customComponent?.config?.reduce<{ label: string; value: string }[]>((acc, cur) => {
      if (cur.component !== 'complex' && cur.type === config.type) {
        return [...acc, { label: cur.label, value: cur.key }];
      }
      return acc;
    }, []) ?? [];

  return (
    <>
      <Select
        label={`${customComponent.name} config`}
        value={options.find((o) => o.value === widgetProp.configKey)}
        onChange={handleChange}
        options={options}
      />
    </>
  );
};
