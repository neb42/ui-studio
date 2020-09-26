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
  const [anchorPoint, setAnchorPoint] = React.useState<{
    row: number;
    col: number;
  } | null>(null);
  const [dragGrid, setDragGrid] = React.useState<{
    top: number;
    left: number;
    bottom: number;
    right: number;
  } | null>(null);

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
    if (dragGrid) {
      const rowMatch = row >= dragGrid.top && row <= dragGrid.bottom;
      const colMatch = col >= dragGrid.left && col <= dragGrid.right;
      return rowMatch && colMatch;
    }
    if (!selectedGrid) return false;
    const rowMatch = row >= selectedGrid[0][0] && row <= selectedGrid[1][0];
    const colMatch = col >= selectedGrid[0][1] && col <= selectedGrid[1][1];
    return rowMatch && colMatch;
  };

  const handleMouseUp = () => {
    if (selectGrid && dragGrid) {
      selectGrid([
        [dragGrid.top, dragGrid.left],
        [dragGrid.bottom, dragGrid.right],
      ]);
    }
    setAnchorPoint(null);
    setDragGrid(null);
  };

  const handleMouseDown = (row: number, col: number) => () => {
    if (selectGrid) {
      setAnchorPoint({ row, col });
      setDragGrid({ top: row, left: col, bottom: row, right: col });
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleMouseEnter = (row: number, col: number) => () => {
    if (selectGrid && anchorPoint && !isDisabled(row, col)) {
      const top = Math.min(row, anchorPoint.row);
      const left = Math.min(col, anchorPoint.col);
      const bottom = Math.max(row, anchorPoint.row);
      const right = Math.max(col, anchorPoint.col);

      if (
        !checkGridOverlap([
          [top, left],
          [bottom, right],
        ])
      ) {
        setDragGrid({ top, left, bottom, right });
      }
    }
  };

  React.useEffect(() => document.removeEventListener('mouseup', handleMouseUp), []);

  return (
    <Styles.Container>
      <Styles.Grid columns={columns} rows={rows}>
        {new Array(rows.length)
          .fill(1)
          .map((_, r) =>
            new Array(columns.length)
              .fill(1)
              .map((__, c) => (
                <Styles.Cell
                  key={r * c}
                  onMouseDown={handleMouseDown(r + 1, c + 1)}
                  onMouseEnter={handleMouseEnter(r + 1, c + 1)}
                  onMouseUp={handleMouseUp}
                  readOnly={!selectGrid}
                  active={isActive(r + 1, c + 1)}
                  disabled={isDisabled(r + 1, c + 1)}
                />
              )),
          )}
      </Styles.Grid>
    </Styles.Container>
  );
};
