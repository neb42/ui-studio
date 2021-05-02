import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Widget, WidgetProp } from '@ui-studio/types';
import { getComponents } from 'selectors/configuration';
import { updateWidgetProps } from 'actions/tree/widget';
import { WidgetConfigItem } from 'components/WidgetConfig/WidgetConfigItem';

import * as Styles from './WidgetConfigList.styles';

interface WidgetConfigProps {
  widget: Widget;
}

export const WidgetConfigList = ({ widget }: WidgetConfigProps): JSX.Element => {
  const dispatch = useDispatch();
  const components = useSelector(getComponents);
  const component = components.find((c) => c.key === widget.component);

  const handleOnChange = (propKey: string) => (prop: WidgetProp) => {
    dispatch(updateWidgetProps(propKey, prop));
  };

  if (!component) return <div />;

  return (
    <Styles.Container>
      {component.config?.map((c) => {
        const widgetProp = widget.props[c.key];
        return (
          <>
            <WidgetConfigItem
              widgetId={widget.id}
              widgetProp={widgetProp}
              onChange={handleOnChange(c.key)}
              config={c}
            />
            <Styles.Divider />
          </>
        );
      })}
    </Styles.Container>
  );
};
