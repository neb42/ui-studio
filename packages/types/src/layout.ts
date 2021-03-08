import { FlexAlignment, FlexJustification, GridAlignment } from './style';

export type GridUnit = 'fr' | '%' | 'px' | 'em' | 'min-content' | 'max-content' | 'minmax' | 'auto';

export interface IGridCell {
  value: number | null;
  unit: GridUnit;
}

export interface GridLayout {
  type: 'grid';
  columns: IGridCell[];
  rows: IGridCell[];
  columnGap: number;
  rowGap: number;
  rowAlignment: GridAlignment;
  columnAlignment: GridAlignment;
}

export interface FlexLayout {
  type: 'flex';
  direction: 'row' | 'column';
  align: FlexAlignment;
  justify: FlexJustification;
  wrap: boolean;
}

export type Layout = GridLayout | FlexLayout | null;
