import * as React from 'react';
import { CustomComponent, CustomComponentInstance, Value$Widget, Widget } from '@ui-studio/types';
import { useSelector } from 'react-redux';
import { getRoots, getWidgetsInSelectedTree } from 'selectors/tree';
import { getComponents } from 'selectors/configuration';
import { Select } from '@faculty/adler-web-components';

import * as Styles from './ValueConfig.styles';

type Props = {
  value: Value$Widget;
  handleValueChange: (value: Value$Widget) => any;
};

// TODO: check if exposed properties match the schema

export const WidgetValue = ({ value, handleValueChange }: Props) => {
  const roots = useSelector(getRoots);
  const components = useSelector(getComponents);

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

  const handleWidgetChange = ({ value: v }: any) => {
    const selectedWidget = widgets.find((w) => w.id === v);
    const exposedPropertyOptions = getExposedPropertyOptions(selectedWidget);
    handleValueChange({
      ...value,
      widgetId: v as string,
      property: exposedPropertyOptions[0]?.value,
    });
  };

  const handlePropertyChange = ({ value: v }: any) => {
    handleValueChange({
      ...value,
      property: v as string,
    });
  };

  const selectedWidget = widgets.find((w) => w.id === value.widgetId);

  const exposedPropertyOptions = getExposedPropertyOptions(selectedWidget);

  return (
    <>
      <Select
        label="Widget"
        value={selectedWidget ? { value: selectedWidget.id, label: selectedWidget.name } : null}
        onChange={handleWidgetChange}
        options={widgets.map((w) => ({ value: w.id, label: w.name }))}
      />
      <Select
        label="Widget property"
        value={{ value: value.property, label: value.property }}
        onChange={handlePropertyChange}
        options={exposedPropertyOptions}
      />
    </>
  );
};
