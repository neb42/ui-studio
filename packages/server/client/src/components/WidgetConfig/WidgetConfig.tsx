import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Widget, WidgetProp, ComponentConfig$Input, ComponentConfig$Select } from 'canvas-types';
import { makeGetComponents } from 'selectors/element';
import { StandardConfig } from 'components/ConfigOption/StandardConfig';
import { ListConfig } from 'components/ConfigOption/ListConfig';
import { ComplexConfig } from 'components/ConfigOption/ComplexConfig';
import { updateWidgetProps } from 'actions/widget';

import * as Styles from './WidgetConfig.styles';

interface WidgetConfigProps {
  widget: Widget;
}

export const WidgetConfig = ({ widget }: WidgetConfigProps): JSX.Element => {
  const dispatch = useDispatch();
  const components = useSelector(makeGetComponents());
  const component = components.find((c) => c.name === widget.component);

  const handleOnChange = (widgetId: string) => (propKey: string, prop: WidgetProp) => {
    dispatch(updateWidgetProps(widgetId, propKey, prop));
  };

  if (!component) return <div />;

  return (
    <Styles.Container>
      {component.config.map((c) => {
        const widgetProp = widget.props[c.key];
        if (c.list && widgetProp.mode === 'list')
          return (
            <>
              <ListConfig
                key={c.key}
                widgetProp={widgetProp}
                config={c}
                onChange={handleOnChange(widget.id)}
              />
              <Styles.Divider />
            </>
          );
        if (c.component === 'complex' && widgetProp.mode === 'complex')
          return (
            <>
              <ComplexConfig
                key={c.key}
                widgetProp={widgetProp}
                config={c}
                onChange={handleOnChange(widget.id)}
              />
              <Styles.Divider />
            </>
          );
        if (widgetProp.mode === 'list' || widgetProp.mode === 'complex') throw Error();
        return (
          <>
            <StandardConfig
              key={c.label}
              widgetProp={widgetProp}
              config={c}
              onChange={handleOnChange(widget.id)}
            />
            <Styles.Divider />
          </>
        );
      })}
    </Styles.Container>
  );
};
