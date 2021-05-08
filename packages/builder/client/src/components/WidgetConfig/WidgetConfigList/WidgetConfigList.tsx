import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Widget, WidgetProp, CustomComponent, CustomComponentInstance } from '@ui-studio/types';
import { getComponents } from 'selectors/configuration';
import { getRoots } from 'selectors/tree';
import { updateWidgetProps } from 'actions/tree/widget';
import { WidgetConfigItem } from 'components/WidgetConfig/WidgetConfigItem';

import * as Styles from './WidgetConfigList.styles';

interface WidgetConfigProps {
  widget: Widget | CustomComponentInstance;
}

export const WidgetConfigList = ({ widget }: WidgetConfigProps): JSX.Element => {
  const dispatch = useDispatch();
  const roots = useSelector(getRoots);
  const components = useSelector(getComponents);

  const config = (() => {
    if (widget.type === 'widget') {
      const component = components.find((c) => c.key === widget.component);
      return component?.config ?? null;
    }
    const component = roots.find(
      (c): c is CustomComponent =>
        c.id === widget.customComponentId && c.type === 'customComponent',
    );
    return component?.config ?? null;
  })();

  const handleOnChange = (propKey: string) => (prop: WidgetProp) => {
    dispatch(updateWidgetProps(propKey, prop));
  };

  if (!config) return <div />;

  return (
    <Styles.Container>
      {config.map((c) => {
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
