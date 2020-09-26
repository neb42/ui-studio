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
