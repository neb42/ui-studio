import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Widget, ComponentConfig$Input, ComponentConfig$Select, WidgetProp } from 'canvas-types';
import { updateWidgetProps } from 'actions/widget';
import { ConfigOption } from 'components/ConfigOption/ConfigOption';

interface StandardConfigProps {
  widget: Widget;
  config: ComponentConfig$Input | ComponentConfig$Select;
}

export const StandardConfig = ({ widget, config }: StandardConfigProps): JSX.Element => {
  const dispatch = useDispatch();

  const widgetProp = widget.props[config.key];

  if (widgetProp.mode === 'list') throw Error();

  const handleOnChange = (prop: WidgetProp) => {
    dispatch(updateWidgetProps(widget.id, config.key, prop));
  };

  const handleModeChange = (m: 'static' | 'variable' | 'widget') => {
    const defaultProp = ((): WidgetProp => {
      switch (m) {
        case 'static':
          return {
            mode: 'static',
            type: 'string',
            value: config.component === 'select' ? config.options[0]?.key : '',
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
