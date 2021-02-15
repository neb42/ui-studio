import styled from 'styled-components';
import Color from 'color';
import { IGridCell } from 'canvas-types';

interface IGrid {
  columns: IGridCell[];
  rows: IGridCell[];
}

interface ICell {
  readOnly: boolean;
  active: boolean;
  disabled: boolean;
  theme: {
    colors: {
      brand500: string;
      secondary300: string;
      secondary600: string;
    };
  };
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`;

export const Grid = styled.div`
  width: 100%;
  height: 100px;
  display: grid;
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  grid-template-columns: ${({ columns }: IGrid) =>
    columns
      .map((col) => {
        if (['mincontent', 'maxcontent', 'minmax', 'auto'].includes(col.unit)) {
          return col.unit;
        }
        return `${col.value}${col.unit}`;
      })
      .join(' ')};
  grid-template-rows: ${({ rows }: IGrid) =>
    rows
      .map((row) => {
        if (['mincontent', 'maxcontent', 'minmax', 'auto'].includes(row.unit)) {
          return row.unit;
        }
        return `${row.value}${row.unit}`;
      })
      .join(' ')};
`;

const getColor = ({ theme, readOnly, active, disabled }: ICell) => {
  if (readOnly) return theme.colors.brand500;
  if (active) return theme.colors.brand500;
  if (disabled) return theme.colors.secondary600;
  return theme.colors.secondary300;
};

export const Cell = styled.div`
  background-color: ${(props: ICell) => Color(getColor(props)).alpha(0.2).hsl().string()};
  border: 1px solid ${getColor};
  user-drag: none;
  user-select: none;
  cursor: ${({ readOnly }) => (readOnly ? 'default' : 'pointer')};
`;
