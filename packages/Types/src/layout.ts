import { TStyle } from './style';

export type GridUnit = 'fr' | '%' | 'px' | 'em' | 'mincontent' | 'maxcontent' | 'minmax' | 'auto';

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
    columns?: IGridCell[];
    rows?: IGridCell[];
  };
  style: TStyle;
}

export interface FlexLayout {
  id: string;
  type: 'layout';
  layoutType: 'flex';
  name: string;
  parent: string;
  props: { [key: string]: any };
  position: number;
  style: TStyle;
}

export type Layout = GridLayout | FlexLayout;
