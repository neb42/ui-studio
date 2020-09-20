import styled from 'styled-components';
import Color from 'color';

interface IGridCell {
  value: number;
  unit: 'fr' | '%' | 'px' | 'em' | 'mincontent' | 'maxcontent' | 'minmax' | 'auto';
}

interface IContainer {
  columns: IGridCell[];
  rows: IGridCell[];
}

interface ICell {
  theme: {
    colors: {
      brand500: string;
    };
  };
}

export const Container = styled.div`
  width: 100%;
  height: 100px;
  display: grid;
  grid-column-gap: 8px;
  grid-row-gap: 8px;
  grid-template-columns: ${({ columns }: IContainer) =>
    columns
      .map((col) => {
        if (['mincontent', 'maxcontent', 'minmax', 'auto'].includes(col.unit)) {
          return col.unit;
        }
        return `${col.value}${col.unit}`;
      })
      .join(' ')};
  grid-template-rows: ${({ rows }: IContainer) =>
    rows
      .map((row) => {
        if (['mincontent', 'maxcontent', 'minmax', 'auto'].includes(row.unit)) {
          return row.unit;
        }
        return `${row.value}${row.unit}`;
      })
      .join(' ')};
`;

export const Cell = styled.div`
  background-color: ${({ theme }: ICell) => Color(theme.colors.brand500).alpha(0.4).hsl().string()};
  border: 1px solid ${({ theme }: ICell) => theme.colors.brand500};
`;
