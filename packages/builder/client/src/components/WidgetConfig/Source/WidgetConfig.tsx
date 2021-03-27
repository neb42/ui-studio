import * as React from 'react';
import { useSelector } from 'react-redux';
import Select from '@faculty/adler-web-components/atoms/Select';
import {
  WidgetProp,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
} from 'canvas-types';
import { makeGetComponents, getWidgetsInTree } from 'selectors/element';

interface WidgetConfigProps {
  widgetProp: WidgetProp$Widget;
  onChange: (prop: WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget) => void;
}

export const WidgetConfig = ({ widgetProp, onChange }: WidgetConfigProps): JSX.Element => {
  const components = useSelector(makeGetComponents());

  if (widgetProp.mode !== 'widget')
    throw Error(`Trying to render widget config editor for ${widgetProp.mode} prop`);

  const buildWidgetWidgetProps = (widgetId: string, lookup: string): WidgetProp$Widget => ({
    mode: 'widget',
    widgetId,
    lookup,
    iterable: false,
  });

  const handleIdChange = ({ value }: any) => {
    onChange(buildWidgetWidgetProps(value as string, widgetProp.lookup));
  };

  const handleLookupChange = ({ value }: any) => {
    onChange(buildWidgetWidgetProps(widgetProp.widgetId, value as string));
  };

  const widgets = Object.values(useSelector(getWidgetsInTree)).filter((w) => {
    const comp = components.find((c) => c.name === w.component);
    if (comp) return comp?.exposedProperties.length > 0;
    return false;
  });
  const selectedWidget = widgets.find((w) => w.id === widgetProp.widgetId);
  const exposedPropertyOptions = selectedWidget
    ? components
        .find((c) => c.name === selectedWidget.component)
        ?.exposedProperties.map((p) => ({ value: p, label: p })) ?? []
    : [];

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
