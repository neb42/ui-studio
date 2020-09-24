import { TStyle } from './style';

export type GridUnit = 'fr' | '%' | 'px' | 'em' | 'mincontent' | 'maxcontent' | 'minmax';

export interface IGridCell {
  value: number;
  unit: GridUnit;
}

export interface GridLayout {
  id: string;
  type: 'layout';
  layoutType: 'grid';
  name: string;
  parent: string;
  props: {
    columns?: IGridCell[];
    rows?: IGridCell[];
  };
  style: TStyle;
}
