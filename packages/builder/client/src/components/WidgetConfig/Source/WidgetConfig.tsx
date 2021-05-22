import * as React from 'react';
import { useSelector } from 'react-redux';
import Select from '@faculty/adler-web-components/atoms/Select';
import {
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
  CustomComponent,
  CustomComponentInstance,
  Widget,
} from '@ui-studio/types';
import { getRoots, getWidgetsInSelectedTree } from 'selectors/tree';
import { getComponents } from 'selectors/configuration';

interface WidgetConfigProps {
  widgetProp: WidgetProp$Widget;
  onChange: (prop: WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget) => void;
}

export const WidgetConfig = ({ widgetProp, onChange }: WidgetConfigProps): JSX.Element => {
  const roots = useSelector(getRoots);
  const components = useSelector(getComponents);

  if (widgetProp.mode !== 'widget')
    throw Error(`Trying to render widget config editor for ${widgetProp.mode} prop`);

  const buildWidgetWidgetProps = (widgetId: string, lookup: string): WidgetProp$Widget => ({
    mode: 'widget',
    widgetId,
    lookup,
    iterable: false,
  });

  const getExposedPropertyOptions = (
    selectedWidget: Widget | CustomComponentInstance | undefined,
  ) => {
    if (selectedWidget) {
      if (selectedWidget.type === 'widget') {
        return (
          components
            .find((c) => c.key === selectedWidget.component)
            ?.exposedProperties?.map((p) => ({ value: p, label: p })) ?? []
        );
      }
      if (selectedWidget.type === 'customComponentInstance') {
        const customComponent = roots.find(
          (r): r is CustomComponent =>
            r.id === selectedWidget.customComponentId && r.type === 'customComponent',
        );
        if (customComponent && customComponent.exposedProperties)
          return Object.keys(customComponent.exposedProperties).map((p) => ({
            value: p,
            label: p,
          }));
        return [];
      }
    }
    return [];
  };

  const widgets = useSelector(getWidgetsInSelectedTree).filter((w) => {
    if (w.type === 'widget') {
      const comp = components.find((c) => c.key === w.component);
      if (comp && comp.exposedProperties) return comp.exposedProperties.length > 0;
    }
    if (w.type === 'customComponentInstance') {
      const customComponent = roots.find(
        (r): r is CustomComponent => r.id === w.customComponentId && r.type === 'customComponent',
      );
      if (customComponent && customComponent.exposedProperties)
        return Object.keys(customComponent.exposedProperties).length > 0;
    }
    return false;
  });

  const handleIdChange = ({ value }: any) => {
    const selectedWidget = widgets.find((w) => w.id === value);
    const exposedPropertyOptions = getExposedPropertyOptions(selectedWidget);
    onChange(buildWidgetWidgetProps(value as string, exposedPropertyOptions[0]?.value));
  };

  const handleLookupChange = ({ value }: any) => {
    onChange(buildWidgetWidgetProps(widgetProp.widgetId, value as string));
  };

  const selectedWidget = widgets.find((w) => w.id === widgetProp.widgetId);

  const exposedPropertyOptions = getExposedPropertyOptions(selectedWidget);

  return (
    <>
      <Select
        label="Widget"
        value={selectedWidget ? { value: selectedWidget.id, label: selectedWidget.name } : null}
        onChange={handleIdChange}
        options={widgets.map((w) => ({ value: w.id, label: w.name }))}
      />
      <Select
        label="Widget property"
        value={{ value: widgetProp.lookup, label: widgetProp.lookup }}
        onChange={handleLookupChange}
        options={exposedPropertyOptions}
      />
    </>
  );
};
