import * as React from 'react';
import {
  ComponentConfig$Complex,
  WidgetProp$Complex,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
} from 'canvas-types';
import { ConfigOption } from 'components/ConfigOption';

import * as Styles from './ConfigOption.styles';

interface ListConfigProps {
  widgetProp: WidgetProp$Complex;
  config: ComponentConfig$Complex;
  onChange: (propKey: string, prop: WidgetProp$Complex) => any;
}

export const ComplexConfig = ({ widgetProp, config, onChange }: ListConfigProps): JSX.Element => {
  const handleOnChange = (key: string) => (
    subProp: WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget,
  ) => {
    const prop: WidgetProp$Complex = { ...widgetProp };
    prop.props[key] = subProp;
    onChange(config.key, prop);
  };

  const handleModeChange = (key: string, idx: number) => (m: 'static' | 'variable' | 'widget') => {
    const defaultProp = ((): WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget => {
      switch (m) {
        case 'static': {
          return {
            mode: 'static' as const,
            type: config.config[idx].type,
            value: config.config[idx].defaultValue,
          };
        }
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
    handleOnChange(key)(defaultProp);
  };

  return (
    <Styles.Container nested={false}>
      <Styles.Header>
        <Styles.Label>{config.label}</Styles.Label>
      </Styles.Header>
      {config.config.map((c, idx) => (
        <ConfigOption
          key={idx}
          widgetProp={widgetProp.props[c.key]}
          config={c}
          onChange={handleOnChange(c.key)}
          onModeChange={handleModeChange(c.key, idx)}
          nested
        />
      ))}
    </Styles.Container>
  );
};
