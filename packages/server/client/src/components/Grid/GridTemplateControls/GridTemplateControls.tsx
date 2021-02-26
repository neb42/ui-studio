import * as React from 'react';
import Button from '@faculty/adler-web-components/atoms/Button';
import Input from '@faculty/adler-web-components/atoms/Input';
import Select from '@faculty/adler-web-components/atoms/Select';
import { IGridCell, GridUnit } from 'canvas-types';

import * as Styles from './GridTemplateControls.styles';

const units = ['fr', '%', 'px', 'em', 'auto', 'mincontent', 'maxcontent', 'minmax'] as const;
const initialUnitValues = {
  fr: 1,
  '%': 100,
  px: 100,
  em: 1,
  auto: null,
  mincontent: null,
  maxcontent: null,
  minmax: null,
} as const;

const defaultCell: IGridCell = { value: 1, unit: 'fr' };

interface IGridLayoutConfig {
  name: string;
  config: IGridCell[];
  updateConfig: (c: IGridCell[]) => any;
}

export const GridTemplateControls = ({
  name,
  config,
  updateConfig,
}: IGridLayoutConfig): JSX.Element => {
  const handleAdd = () => {
    updateConfig([...config, defaultCell]);
  };

  const handleRemove = (idx: number) => () => {
    updateConfig(config.filter((_, i) => i !== idx));
  };

  const handleValueChange = (idx: number) => (value: string) => {
    updateConfig(
      config.map((r, i) => {
        if (i === idx) {
          return { ...r, value: Number(value) };
        }
        return r;
      }),
    );
  };

  const handleUnitChange = (idx: number) => ({ value }: any) => {
    const v = value as GridUnit;
    updateConfig(
      config.map((r, i) => {
        if (i === idx) {
          return { ...r, unit: value, value: initialUnitValues[v] };
        }
        return r;
      }),
    );
  };

  const showValueControl = (unit: GridUnit) => ['fr', '%', 'px', 'em'].includes(unit);

  return (
    <Styles.Container>
      <Styles.Header>
        <Styles.Name>{name}s</Styles.Name>
        <Button
          icon="add"
          onClick={handleAdd}
          style={Button.styles.naked}
          color={Button.colors.secondary}
          size={Button.sizes.medium}
        />
      </Styles.Header>
      {config.map((c, i) => (
        <Styles.Cell key={i} showValueControl={showValueControl(c.unit)}>
          {showValueControl(c.unit) && (
            <Input
              type="number"
              value={c.value || ''}
              onChange={handleValueChange(i)}
              disabled={c.value === null}
            />
          )}
          <Select
            value={{ value: c.unit, label: c.unit }}
            onChange={handleUnitChange(i)}
            options={units.map((u) => ({ value: u, label: u }))}
          />
          <Button
            icon="delete"
            onClick={handleRemove(i)}
            style={Button.styles.naked}
            color={Button.colors.secondary}
            size={Button.sizes.medium}
            disabled={config.length === 1}
          />
        </Styles.Cell>
      ))}
    </Styles.Container>
  );
};
