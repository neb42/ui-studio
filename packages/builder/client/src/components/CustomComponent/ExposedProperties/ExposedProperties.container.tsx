import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CustomComponent } from '@ui-studio/types';
import { getWidgetsInSelectedTree } from 'selectors/tree';
import { getComponents } from 'selectors/configuration';
import {
  addExposedProperty,
  removeExposedProperty,
  updateExposedPropertyKey,
} from 'actions/tree/customComponent';

import { ExposedPropertiesComponent } from './ExposedProperties.component';

type Props = {
  customComponent: CustomComponent;
};

export const ExposedPropertiesContainer = ({ customComponent }: Props) => {
  const dispatch = useDispatch();

  const components = useSelector(getComponents);
  const widgets = useSelector(getWidgetsInSelectedTree);

  const availableExposedProperties = widgets.reduce<Record<string, string[]>>((acc, cur) => {
    if (cur.type === 'widget') {
      const component = components.find((c) => c.key === cur.component);
      if (component?.exposedProperties && component.exposedProperties.length > 0)
        return {
          ...acc,
          [cur.id]: component.exposedProperties || [],
        };
    }
    return acc;
  }, {});

  const handleAddExposedProperty = (widgetId: string, property: string) =>
    dispatch(addExposedProperty(widgetId, property));

  const handleRemoveExposedProperty = (key: string) => dispatch(removeExposedProperty(key));

  const handleUpdateExposedPropertyKey = (oldKey: string, newKey: string) =>
    dispatch(updateExposedPropertyKey(oldKey, newKey));

  return (
    <ExposedPropertiesComponent
      widgetIdNameMap={widgets.reduce<Record<string, string>>(
        (acc, cur) => ({ ...acc, [cur.id]: cur.name }),
        {},
      )}
      selectedExposedProperties={customComponent.exposedProperties || {}}
      availableExposedProperties={availableExposedProperties}
      onAddExposedProperty={handleAddExposedProperty}
      onRemoveExposedProperty={handleRemoveExposedProperty}
      onUpdateExposedPropertyKey={handleUpdateExposedPropertyKey}
    />
  );
};
