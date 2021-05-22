import * as React from 'react';
import Select from '@faculty/adler-web-components/atoms/Select';
import { Select$Option } from '@faculty/adler-web-components/types/Select';
import { CustomComponent$ExposedProperties } from '@ui-studio/types';
import Input from '@faculty/adler-web-components/atoms/Input';

import * as Styles from './ExposedProperties.styles';

type Props = {
  widgetIdNameMap: Record<string, string>;
  selectedExposedProperties: Record<string, CustomComponent$ExposedProperties>;
  availableExposedProperties: Record<string, string[]>;
  onAddExposedProperty: (widgetId: string, property: string) => any;
  onRemoveExposedProperty: (key: string) => any;
  onUpdateExposedPropertyKey: (oldKey: string, newKey: string) => any;
};

export const ExposedPropertiesComponent = ({
  widgetIdNameMap,
  selectedExposedProperties,
  availableExposedProperties,
  onAddExposedProperty,
  onRemoveExposedProperty,
  onUpdateExposedPropertyKey,
}: Props): JSX.Element => {
  const availableExposedPropertyOptions = Object.keys(availableExposedProperties).map(
    (widgetId) => ({
      label: widgetIdNameMap[widgetId],
      options: availableExposedProperties[widgetId].map((p) => ({
        value: { widgetId, property: p },
        label: p,
      })),
    }),
  );

  const handleSelectOnChange = (value: Select$Option[]) => {
    const addedProperties = value.reduce<CustomComponent$ExposedProperties[]>((acc, cur) => {
      const existing = Object.keys(selectedExposedProperties).find(
        (k) =>
          selectedExposedProperties[k].widgetId === cur.value.widgetId &&
          selectedExposedProperties[k].property === cur.value.property,
      );
      if (existing) return [...acc];
      return [...acc, cur.value];
    }, []);

    addedProperties.map((p) => onAddExposedProperty(p.widgetId, p.property));

    const removedProperties = Object.keys(selectedExposedProperties).reduce<string[]>(
      (acc, cur) => {
        const existing = value.find(
          (v) =>
            selectedExposedProperties[cur].widgetId === v.value.widgetId &&
            selectedExposedProperties[cur].property === v.value.property,
        );
        if (existing) return [...acc];
        return [...acc, cur];
      },
      [],
    );

    removedProperties.map((k) => onRemoveExposedProperty(k));
  };

  const handleInputOnChange = (idx: number) => (value: string) => {
    const oldKey = Object.keys(selectedExposedProperties)[idx];
    onUpdateExposedPropertyKey(oldKey, value);
  };

  return (
    <Styles.Container>
      <Select
        label="Available properties"
        multi
        value={Object.values(selectedExposedProperties).map((v) => ({
          label: v.property,
          value: v,
        }))}
        options={availableExposedPropertyOptions}
        onChange={handleSelectOnChange as any}
      />
      {Object.keys(selectedExposedProperties).map((k, i) => (
        <Input
          key={i}
          value={k}
          label={`${widgetIdNameMap[selectedExposedProperties[k].widgetId]} - ${
            selectedExposedProperties[k].property
          }`}
          onChange={handleInputOnChange(i)}
        />
      ))}
    </Styles.Container>
  );
};
