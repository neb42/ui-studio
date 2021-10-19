import * as React from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListSubheader from '@mui/material/ListSubheader';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CustomComponent$ExposedProperties, ExposedProperty } from '@ui-studio/types';

import * as Styles from './ExposedProperties.styles';

type Props = {
  widgetIdNameMap: Record<string, string>;
  selectedExposedProperties: Record<string, CustomComponent$ExposedProperties>;
  availableExposedProperties: Record<string, ExposedProperty[]>;
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
        value: { widgetId, property: p.property },
        label: p.property,
      })),
    }),
  );

  const handleSelectOnChange = (event: SelectChangeEvent<string[]>) => {
    const value = (event.target.value as string[]).map((v) => {
      const [widgetId, property] = v.split(' ');
      return { widgetId, property };
    });
    const addedProperties = value.reduce<CustomComponent$ExposedProperties[]>((acc, cur) => {
      const existing = Object.keys(selectedExposedProperties).find(
        (k) =>
          selectedExposedProperties[k].widgetId === cur.widgetId &&
          selectedExposedProperties[k].property === cur.property,
      );
      if (existing) return [...acc];
      return [...acc, cur];
    }, []);

    addedProperties.map((p) => onAddExposedProperty(p.widgetId, p.property));

    const removedProperties = Object.keys(selectedExposedProperties).reduce<string[]>(
      (acc, cur) => {
        const existing = value.find(
          (v) =>
            selectedExposedProperties[cur].widgetId === v.widgetId &&
            selectedExposedProperties[cur].property === v.property,
        );
        if (existing) return [...acc];
        return [...acc, cur];
      },
      [],
    );

    removedProperties.map((k) => onRemoveExposedProperty(k));
  };

  const handleInputOnChange = (idx: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const oldKey = Object.keys(selectedExposedProperties)[idx];
    onUpdateExposedPropertyKey(oldKey, event.target.value);
  };

  const makeValueFromObject = (obj: CustomComponent$ExposedProperties) =>
    `${obj.widgetId} ${obj.property}`;

  const value = Object.values(selectedExposedProperties).map((v) => makeValueFromObject(v));

  return (
    <Styles.Container>
      <FormControl fullWidth>
        <InputLabel>Available properties</InputLabel>
        <Select multiple value={value} label="Available properties" onChange={handleSelectOnChange}>
          {availableExposedPropertyOptions.map((o) => [
            <ListSubheader key={o.label}>{o.label}</ListSubheader>,
            ...o.options.map((oo) => (
              <MenuItem key={makeValueFromObject(oo.value)} value={makeValueFromObject(oo.value)}>
                {oo.label}
              </MenuItem>
            )),
          ])}
        </Select>
      </FormControl>
      {Object.keys(selectedExposedProperties).map((k, i) => (
        <TextField
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
