import * as React from 'react';
import { useDispatch } from 'react-redux';
import Button from '@faculty/adler-web-components/atoms/Button';
import {
  Widget,
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
    const defaultProp = { mode: 'static' as const, type: config.type, value: config.defaultValue };

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
