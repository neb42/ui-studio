import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Widget, WidgetProp, CustomComponent, CustomComponentInstance } from '@ui-studio/types';
import { getComponents } from 'selectors/configuration';
import { getRoots, getSelectedRootElement } from 'selectors/tree';
import { updateWidgetProps } from 'actions/widget';
import { WidgetConfigItem } from 'components/WidgetConfig/WidgetConfigItem';

import * as Styles from './WidgetConfigList.styles';

interface WidgetConfigProps {
  widget: Widget | CustomComponentInstance;
}

export const WidgetConfigList = ({ widget }: WidgetConfigProps): JSX.Element => {
  const dispatch = useDispatch();
  const root = useSelector(getSelectedRootElement);
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

  if (!root || !config) return <div />;

  return (
    <Styles.Container>
      {config.map((c) => {
        const widgetProp = widget.props[c.key];
        return (
          <WidgetConfigItem
            key={c.key}
            widgetId={widget.id}
            rootType={root.type}
            widgetProp={widgetProp}
            onChange={handleOnChange(c.key)}
            config={c}
          />
        );
      })}
    </Styles.Container>
  );
};
