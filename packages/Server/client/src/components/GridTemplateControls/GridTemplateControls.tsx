import * as React from 'react';
import { TextField, IconButton, Button, Select, MenuItem } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

import * as Styles from './GridTemplateControls.styles';

type Unit = 'fr' | '%' | 'px' | 'em' | 'mincontent' | 'maxcontent' | 'minmax';

interface IGridCell {
  value: number;
  unit: Unit;
}

const units: ['fr', '%', 'px', 'em', 'mincontent', 'maxcontent', 'minmax'] = [
  'fr',
  '%',
  'px',
  'em',
  'mincontent',
  'maxcontent',
  'minmax',
];

const defaultCell: IGridCell = { value: 1, unit: 'fr' };

type StateFunction = (config: IGridCell[]) => IGridCell[];
interface IGridLayoutConfig {
  name: string;
  config: IGridCell[];
  updateConfig: (f: StateFunction) => void;
}

export const GridTemplateControls = ({
  name,
  config,
  updateConfig,
}: IGridLayoutConfig): JSX.Element => {
  const handleAdd = () => {
    updateConfig((prevState) => [...prevState, defaultCell]);
  };

  const handleRemove = (idx: number) => () => {
    updateConfig((prevState) => prevState.filter((_, i) => i !== idx));
  };

  const handleValueChange = (idx: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    updateConfig((prevState) =>
      prevState.map((r, i) => {
        if (i === idx) {
          return { ...r, value: Number(value) };
        }
        return r;
      }),
    );
  };

  const handleUnitChange = (idx: number) => (event: React.ChangeEvent<{ value: unknown }>) => {
    const { value } = event.target;
    updateConfig((prevState) =>
      prevState.map((r, i) => {
        if (i === idx) {
          return { ...r, unit: value as Unit };
        }
        return r;
      }),
    );
  };

  return (
    <Styles.Container>
      <Styles.Header>
        <Styles.Name>{name}</Styles.Name>
        <Button
          onClick={handleAdd}
          variant="contained"
          color="primary"
          size="small"
          disableElevation
        >
          Add {name}
        </Button>
      </Styles.Header>
      {config.map((c, i) => (
        <Styles.Cell key={i}>
          <TextField type="number" value={c.value} onChange={handleValueChange(i)} />
          <Select value={c.unit} onChange={handleUnitChange(i)}>
            {units.map((u) => (
              <MenuItem key={u} value={u}>
                {u}
              </MenuItem>
            ))}
          </Select>
          <IconButton aria-label="delete" onClick={handleRemove(i)} disabled={config.length === 1}>
            <Clear />
          </IconButton>
        </Styles.Cell>
      ))}
    </Styles.Container>
  );
};
