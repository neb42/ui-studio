import * as React from 'react';
import { useDispatch } from 'react-redux';
import Button from '@faculty/adler-web-components/atoms/Button';
import {
  Widget,
  WidgetProp,
  ComponentConfig,
  WidgetProp$List,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
} from 'canvas-types';
import { ConfigOption } from 'components/ConfigOption';
import { updateWidgetProps } from 'actions/widget';

import * as Styles from './ConfigOption.styles';

interface ListConfigProps {
  widget: Widget;
  config: ComponentConfig;
}

export const ListConfig = ({ widget, config }: ListConfigProps): JSX.Element => {
  const dispatch = useDispatch();

  const widgetProp = widget.props[config.key];

  if (widgetProp.mode !== 'list') throw Error();

  const handleAddProp = () => {
    const defaultProp: WidgetProp = (() => {
      switch (config.type) {
        case 'string': {
          const value = config.component === 'input' ? '' : config.options[0]?.key ?? '';
          return { mode: 'static', type: 'string', value } as const;
        }
        case 'number': {
          const value = config.component === 'input' ? 0 : config.options[0]?.key ?? 0;
          return { mode: 'static', type: 'number', value } as const;
        }
        case 'boolean': {
          const value = config.component === 'input' ? true : config.options[0]?.key ?? true;
          return { mode: 'static', type: 'boolean', value } as const;
        }
        case 'object': {
          const value = config.component === 'input' ? '' : config.options[0]?.key ?? '';
          return { mode: 'static', type: 'object', value } as const;
        }
        default:
          throw Error();
      }
    })();

    const prop: WidgetProp$List = { ...widgetProp };
    prop.props.push(defaultProp);
    dispatch(updateWidgetProps(widget.id, config.key, prop));
  };

  const handleOnChange = (idx: number) => (
    subProp: WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget,
  ) => {
    const prop: WidgetProp$List = { ...widgetProp };
    prop.props[idx] = subProp;
    dispatch(updateWidgetProps(widget.id, config.key, prop));
  };

  const handleModeChange = (idx: number) => (m: 'static' | 'variable' | 'widget') => {
    const defaultProp = ((): WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget => {
      switch (m) {
        case 'static': {
          switch (config.type) {
            case 'string':
              return {
                mode: 'static',
                type: config.type,
                value: config.component === 'select' ? config.options[0]?.key : '',
              };
            case 'number':
              return {
                mode: 'static',
                type: config.type,
                value: config.component === 'select' ? config.options[0]?.key : 0,
              };
            case 'boolean':
              return {
                mode: 'static',
                type: config.type,
                value: config.component === 'select' ? config.options[0]?.key : true,
              };
            case 'object':
              return {
                mode: 'static',
                type: config.type,
                value: config.component === 'select' ? config.options[0]?.key : '',
              };
            default:
              throw Error();
          }
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
    dispatch(updateWidgetProps(widget.id, config.key, prop));
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
      {widgetProp.props.map((p, idx) => (
        <ConfigOption
          key={idx}
          widgetProp={p}
          config={config}
          onChange={handleOnChange(idx)}
          onModeChange={handleModeChange(idx)}
          onDelete={handleDelete(idx)}
          nested
        />
      ))}
    </Styles.Container>
  );
};
