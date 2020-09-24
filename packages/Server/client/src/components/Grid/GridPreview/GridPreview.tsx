import * as React from 'react';
import { IGridCell } from '@ui-builder/types';

import * as Styles from './GridPreview.styles';

interface IGridPreview {
  columns: IGridCell[];
  rows: IGridCell[];
}

export const GridPreview = ({ columns, rows }: IGridPreview): JSX.Element => {
  return (
    <Styles.Container columns={columns} rows={rows}>
      {new Array(columns.length * rows.length).fill(1).map((_, i) => (
        <Styles.Cell key={i} />
      ))}
    </Styles.Container>
  );
};
