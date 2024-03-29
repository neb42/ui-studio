import styled from 'styled-components';
import Color from 'color';
import { IGridCell } from '@ui-studio/types';

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
        return '1fr';
        if (['mincontent', 'maxcontent', 'minmax', 'auto'].includes(col.unit)) {
          // return col.unit;
          return '12px';
        }
        return `${col.value}${col.unit}`;
      })
      .join(' ')};
  grid-template-rows: ${({ rows }: IGrid) =>
    rows
      .map((row) => {
        return '1fr';
        if (['mincontent', 'maxcontent', 'minmax', 'auto'].includes(row.unit)) {
          // return row.unit;
          return '12px';
        }
        return `${row.value}${row.unit}`;
      })
      .join(' ')};
`;

const getColor = ({ theme, readOnly, active, disabled }: any) => {
  if (readOnly) return theme.palette.primary.main;
  if (active) return theme.palette.primary.main;
  if (disabled) return theme.palette.info.main;
  return theme.palette.info.light;
};

export const Cell = styled.div`
  background-color: ${(props: ICell) => Color(getColor(props)).alpha(0.2).hsl().string()};
  border: 1px solid ${getColor};
  user-drag: none;
  user-select: none;
  cursor: ${({ readOnly }) => (readOnly ? 'default' : 'pointer')};
`;
