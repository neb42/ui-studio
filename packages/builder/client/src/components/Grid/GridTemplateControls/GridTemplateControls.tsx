import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AddSharp from '@mui/icons-material/AddSharp';
import DeleteSharp from '@mui/icons-material/DeleteSharp';
import Input from '@faculty/adler-web-components/atoms/Input';
import Select from '@faculty/adler-web-components/atoms/Select';
import { IGridCell, GridUnit } from '@ui-studio/types';

import * as Styles from './GridTemplateControls.styles';

// const units = ['fr', '%', 'px', 'em', 'auto', 'min-content', 'max-content', 'minmax'] as const;
const units = ['fr', '%', 'px', 'em', 'auto', 'min-content', 'max-content'] as const;
const initialUnitValues = {
  fr: 1,
  '%': 100,
  px: 100,
  em: 1,
  auto: null,
  'min-content': null,
  'max-content': null,
  minmax: null,
} as const;

const defaultCell: IGridCell = { value: null, unit: 'auto' };

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
        <IconButton onClick={handleAdd} size="small">
          <AddSharp />
        </IconButton>
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
          <IconButton onClick={handleRemove(i)} disabled={config.length === 1} size="small">
            <DeleteSharp />
          </IconButton>
        </Styles.Cell>
      ))}
    </Styles.Container>
  );
};
