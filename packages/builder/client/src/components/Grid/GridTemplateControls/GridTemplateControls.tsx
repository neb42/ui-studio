import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import AddSharp from '@mui/icons-material/AddSharp';
import DeleteSharp from '@mui/icons-material/DeleteSharp';
import TextField from '@mui/material/TextField';
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

  const handleValueChange = (idx: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig(
      config.map((r, i) => {
        if (i === idx) {
          return { ...r, value: Number(event.target.value) };
        }
        return r;
      }),
    );
  };

  const handleUnitChange = (idx: number) => (event: SelectChangeEvent) => {
    const v = event.target.value as GridUnit;
    updateConfig(
      config.map((r, i) => {
        if (i === idx) {
          return { ...r, unit: v, value: initialUnitValues[v] };
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
            <TextField
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              value={c.value || ''}
              onChange={handleValueChange(i)}
              disabled={c.value === null}
            />
          )}
          <FormControl fullWidth>
            <Select value={c.unit} onChange={handleUnitChange(i)}>
              {units.map((u) => (
                <MenuItem key={u} value={u}>
                  {u}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton onClick={handleRemove(i)} disabled={config.length === 1} size="small">
            <DeleteSharp />
          </IconButton>
        </Styles.Cell>
      ))}
    </Styles.Container>
  );
};
