import { FlexAlignment, FlexJustification, GridAlignment, TStyle } from './style';

export type GridUnit = 'fr' | '%' | 'px' | 'em' | 'min-content' | 'max-content' | 'minmax' | 'auto';

export interface IGridCell {
  value: number | null;
  unit: GridUnit;
}

export interface GridLayout {
  id: string;
  type: 'layout';
  layoutType: 'grid';
  name: string;
  parent: string;
  position: number;
  props: {
    columns: IGridCell[];
    rows: IGridCell[];
    columnGap: number;
    rowGap: number;
    rowAlignment: GridAlignment;
    columnAlignment: GridAlignment;
  };
  style: TStyle;
}

export interface FlexLayout {
  id: string;
  type: 'layout';
  layoutType: 'flex';
  name: string;
  parent: string;
  props: {
    direction: 'row' | 'column';
    align: FlexAlignment;
    justify: FlexJustification;
    wrap: boolean;
  };
  position: number;
  style: TStyle;
}

export type Layout = GridLayout | FlexLayout;
