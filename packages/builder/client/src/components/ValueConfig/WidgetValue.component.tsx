import * as React from 'react';
import { useSelector } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CustomComponent, CustomComponentInstance, Value$Widget, Widget } from '@ui-studio/types';
import { getRoots, getWidgetsInSelectedTree } from 'selectors/tree';
import { getComponents } from 'selectors/configuration';
import { Store, Store$Widget } from 'types/store';
import { compareSchemas } from 'utils/openapi';
import { OpenAPIV3 } from 'openapi-types';

type Props = {
  value: Value$Widget;
  schema: OpenAPIV3.SchemaObject;
  handleValueChange: (value: Value$Widget) => any;
};

export const WidgetValue = ({ schema, value, handleValueChange }: Props) => {
  const roots = useSelector(getRoots);
  const components = useSelector(getComponents);
  const allWidgets = useSelector<Store, Store$Widget>((state) => state.widget);

  const widgets = useSelector(getWidgetsInSelectedTree).filter((w) => {
    const handleWidget = (widget: Widget) => {
      const comp = components.find((c) => c.key === widget.component);
      const matchingExposedProperties =
        comp?.exposedProperties?.filter((p) => compareSchemas(p.schema, schema)) ?? [];
      return matchingExposedProperties.length > 0;
    };

    const handleAddCustomComponentInstance = (customComponentInstance: CustomComponentInstance) => {
      const customComponent = roots.find(
        (r): r is CustomComponent =>
          r.id === customComponentInstance.customComponentId && r.type === 'customComponent',
      );
      if (!customComponent || !customComponent.exposedProperties) return false;
      const ep = customComponent.exposedProperties;
      const availableExposedProperties = Object.keys(
        customComponent?.exposedProperties || {},
      ).filter((p) => {
        const widget = allWidgets[customComponent.id][ep[p].widgetId];
        if (widget.type === 'customComponentInstance') return false; // TODO handle this
        const comp = components.find((c) => c.key === widget.component);
        if (!comp) return false;
        const widgetEp = comp.exposedProperties?.find((pp) => pp.property === ep[p].property);
        if (!widgetEp) return false;
        return compareSchemas(widgetEp.schema, schema);
      });
      return availableExposedProperties.length > 0;
    };

    if (w.type === 'widget') {
      return handleWidget(w);
    }

    if (w.type === 'customComponentInstance') {
      return handleAddCustomComponentInstance(w);
    }

    return false;
  });

  const getExposedPropertyOptions = (
    selectedWidget: Widget | CustomComponentInstance | undefined,
  ) => {
    const raw = (() => {
      if (selectedWidget) {
        const handleWidget = (widget: Widget) => {
          const comp = components.find((c) => c.key === widget.component);
          const matchingExposedProperties =
            comp?.exposedProperties?.filter((p) => compareSchemas(p.schema, schema)) ?? [];
          return matchingExposedProperties;
        };

        const handleAddCustomComponentInstance = (
          customComponentInstance: CustomComponentInstance,
        ) => {
          const customComponent = roots.find(
            (r): r is CustomComponent =>
              r.id === customComponentInstance.customComponentId && r.type === 'customComponent',
          );
          if (!customComponent || !customComponent.exposedProperties) return [];
          const ep = customComponent.exposedProperties;
          const matchingExposedProperties = Object.keys(ep)
            .filter((p) => {
              const widget = allWidgets[customComponent.id][ep[p].widgetId];
              if (widget.type === 'customComponentInstance') return []; // TODO handle this
              const comp = components.find((c) => c.key === widget.component);
              if (!comp) return [];
              const widgetEp = comp.exposedProperties?.find((pp) => pp.property === ep[p].property);
              if (!widgetEp) return [];
              return compareSchemas(widgetEp.schema, schema);
            })
            .map((key) => ep[key]);
          return matchingExposedProperties;
        };

        if (selectedWidget.type === 'widget') {
          return handleWidget(selectedWidget);
        }

        if (selectedWidget.type === 'customComponentInstance') {
          return handleAddCustomComponentInstance(selectedWidget);
        }

        return [];
      }
      return [];
    })();

    return raw.map((r: typeof raw[number]) => ({ label: r.property, value: r.property }));
  };

  const handleWidgetChange = (event: SelectChangeEvent) => {
    const v = event.target.value as string;
    const selectedWidget = widgets.find((w) => w.id === v);
    const exposedPropertyOptions = getExposedPropertyOptions(selectedWidget);
    handleValueChange({
      ...value,
      widgetId: v,
      property: exposedPropertyOptions[0]?.value,
    });
  };

  const handlePropertyChange = (event: SelectChangeEvent) => {
    handleValueChange({
      ...value,
      property: event.target.value as string,
    });
  };

  const selectedWidget = widgets.find((w) => w.id === value.widgetId);

  const exposedPropertyOptions = getExposedPropertyOptions(selectedWidget);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Widget</InputLabel>
        <Select value={selectedWidget?.id} label="Widget" onChange={handleWidgetChange}>
          {widgets.map((w) => (
            <MenuItem key={w.id} value={w.id}>
              {w.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Widget property</InputLabel>
        <Select value={value.property} label="Widget property" onChange={handlePropertyChange}>
          {exposedPropertyOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
