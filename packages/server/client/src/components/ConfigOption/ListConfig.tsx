import * as React from 'react';
import Button from '@faculty/adler-web-components/atoms/Button';
import {
  Widget,
  ComponentConfig,
  WidgetProp$List,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
  WidgetProp$Complex,
} from 'canvas-types';
import { ConfigOption } from 'components/ConfigOption';

import * as Styles from './ConfigOption.styles';
import { ComplexConfig } from './ComplexConfig';

interface ListConfigProps {
  widgetProp: WidgetProp$List;
  config: ComponentConfig;
  onChange: (propKey: string, prop: WidgetProp$List) => any;
}

export const ListConfig = ({ widgetProp, config, onChange }: ListConfigProps): JSX.Element => {
  if (!config.list) throw Error();

  const handleAddProp = () => {
    const defaultProp = (() => {
      if (config.component === 'complex')
        return {
          mode: 'complex' as const,
          props: config.config.reduce((acc, cur) => {
            return { ...acc, [cur.key]: cur.defaultValue };
          }, {}),
        };
      return { mode: 'static' as const, type: config.type, value: config.defaultValue };
    })();

    const prop: WidgetProp$List = { ...widgetProp };
    prop.props.push(defaultProp);
    onChange(config.key, prop);
  };

  const handleOnChange = (idx: number) => (
    subProp: WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget | WidgetProp$Complex,
  ) => {
    const prop: WidgetProp$List = { ...widgetProp };
    prop.props[idx] = subProp;
    onChange(config.key, prop);
  };

  const handleModeChange = (idx: number) => (m: 'static' | 'variable' | 'widget') => {
    if (config.component === 'complex') return;
    const defaultProp = ((): WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget => {
      switch (m) {
        case 'static': {
          return { mode: 'static' as const, type: config.type, value: config.defaultValue };
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
    handleOnChange(idx)(defaultProp);
  };

  const handleDelete = (idx: number) => () => {
    const prop: WidgetProp$List = { ...widgetProp };
    prop.props = prop.props.filter((_, i) => i !== idx);
    onChange(config.key, prop);
  };

  return (
    <Styles.Container nested={false}>
      <Styles.Header>
        <Styles.Label>{config.label}</Styles.Label>
        <Button
          icon="add"
          style={Button.styles.naked}
          color={Button.colors.secondary}
          size={Button.sizes.medium}
          onClick={handleAddProp}
        />
      </Styles.Header>
      {widgetProp.props.map((p, idx) =>
        config.component === 'complex' ? (
          <ComplexConfig
            widgetProp={p as WidgetProp$Complex}
            config={config}
            onChange={(_: string, prop: WidgetProp$Complex) => handleOnChange(idx)(prop)}
          />
        ) : (
          <ConfigOption
            key={idx}
            widgetProp={p}
            config={config}
            onChange={handleOnChange(idx)}
            onModeChange={handleModeChange(idx)}
            onDelete={handleDelete(idx)}
            nested
          />
        ),
      )}
    </Styles.Container>
  );
};
