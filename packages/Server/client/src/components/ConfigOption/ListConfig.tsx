import * as React from 'react';
import { useDispatch } from 'react-redux';
import Button from '@faculty/adler-web-components/atoms/Button';
import { Widget, WidgetProp, ComponentConfig$List } from '@ui-builder/types';
import { ConfigOption } from 'components/ConfigOption';
import { updateWidgetProps } from 'actions/widget';

import * as Styles from './ConfigOption.styles';

interface ListConfigProps {
  widget: Widget;
  config: ComponentConfig$List;
}

export const ListConfig = ({ widget, config }: ListConfigProps): JSX.Element => {
  const dispatch = useDispatch();

  const widgetProp = widget.props[config.key];

  if (!Array.isArray(widgetProp)) throw Error();

  const handleOnChange = (idx: number) => (subProp: WidgetProp) => {
    const prop = [...widgetProp];
    prop[idx] = subProp;
    dispatch(updateWidgetProps(widget.id, config.key, prop));
  };

  const handleModeChange = (idx: number) => (m: 'static' | 'variable' | 'widget') => {
    const defaultProp = ((): WidgetProp => {
      switch (m) {
        case 'static': {
          const opt = config.options[idx];
          return {
            mode: 'static',
            type: 'string',
            value: opt.component === 'select' ? opt.options[0]?.key : '',
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
    handleOnChange(idx)(defaultProp);
  };

  return (
    <Styles.Container>
      <Styles.Header>
        <Styles.Label>{config.label}</Styles.Label>
        <Button
          icon="add"
          style={Button.styles.naked}
          color={Button.colors.secondary}
          size={Button.sizes.medium}
        />
      </Styles.Header>
      {config.options.map((o, idx) => (
        <ConfigOption
          key={o.key}
          widgetProp={widgetProp[idx]}
          config={o}
          onChange={handleOnChange(idx)}
          onModeChange={handleModeChange(idx)}
        />
      ))}
    </Styles.Container>
  );
};
