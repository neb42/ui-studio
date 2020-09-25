import * as React from 'react';
import { IconButton } from '@material-ui/core';
import { ClearSharp } from '@material-ui/icons';
import { IGridCell, TGridStyleLayout } from '@ui-builder/types';

import * as Styles from './GridPreview.styles';

interface IGridPreview {
  columns: IGridCell[];
  rows: IGridCell[];
  // eslint-disable-next-line react/require-default-props
  selectedGrid?: TGridStyleLayout;
  // eslint-disable-next-line react/require-default-props
  usedGridSpace?: TGridStyleLayout[];
  // eslint-disable-next-line react/require-default-props
  selectGrid?: (grid: TGridStyleLayout) => any;
}

export const GridPreview = ({
  columns,
  rows,
  selectedGrid,
  usedGridSpace,
  selectGrid,
}: IGridPreview): JSX.Element => {
  const [topLeft, setTopLeft] = React.useState<[number, number] | null>(null);
  const [bottomRight, setBottomRight] = React.useState<[number, number] | null>(null);

  const isDisabled = (row: number, col: number) =>
    usedGridSpace
      ? usedGridSpace.some((g) => {
          const rowMatch = row >= g[0][0] && row <= g[1][0];
          const colMatch = col >= g[0][1] && col <= g[1][1];
          return rowMatch && colMatch;
        })
      : false;

  const checkGridOverlap = (grid: TGridStyleLayout) =>
    usedGridSpace
      ? usedGridSpace.some(
          (compare) =>
            !(
              // grid right left of compare left
              (
                grid[1][0] < compare[0][0] ||
                // grid left right of compare right
                grid[0][0] > compare[1][0] ||
                // grid bottom above compare top
                grid[1][1] < compare[0][1] ||
                // grid top below compare bottom
                grid[0][1] > compare[1][1]
              )
            ),
        )
      : false;

  const isActive = (row: number, col: number) => {
    if (topLeft && bottomRight) {
      const rowMatch = row >= topLeft[0] && row <= bottomRight[0];
      const colMatch = col >= topLeft[1] && col <= bottomRight[1];
      return rowMatch && colMatch;
    }
    if (!selectedGrid) return false;
    const rowMatch = row >= selectedGrid[0][0] && row <= selectedGrid[1][0];
    const colMatch = col >= selectedGrid[0][1] && col <= selectedGrid[1][1];
    return rowMatch && colMatch;
  };

  const handleMouseUp = () => {
    if (selectGrid && topLeft && bottomRight) {
      selectGrid([topLeft, bottomRight]);
    }
    setTopLeft(null);
    setBottomRight(null);
  };

  const handleMouseDown = (row: number, col: number) => () => {
    if (selectGrid) {
      setTopLeft([row, col]);
      setBottomRight([row, col]);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseEnter = (row: number, col: number) => () => {
    if (
      selectGrid &&
      topLeft &&
      !isDisabled(row, col) &&
      !checkGridOverlap([topLeft, [row, col]])
    ) {
      setBottomRight([row, col]);
    }
  };

  React.useEffect(() => document.removeEventListener('mouseup', handleMouseUp), []);

  return (
    <Styles.Container>
      <Styles.Grid columns={columns} rows={rows}>
        {new Array(rows.length).fill(1).map((_, r) =>
          new Array(columns.length).fill(1).map((__, c) => (
            <Styles.Cell
              key={r * c}
              onMouseDown={handleMouseDown(r + 1, c + 1)}
              onMouseEnter={handleMouseEnter(r + 1, c + 1)}
              onMouseUp={handleMouseUp}
              readOnly={!selectGrid}
              // onClick={handleOnClick(r + 1, c + 1)}
              active={isActive(r + 1, c + 1)}
              disabled={isDisabled(r + 1, c + 1)}
            />
          )),
        )}
      </Styles.Grid>
    </Styles.Container>
  );
};
