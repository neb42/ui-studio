export interface IGridStyle {
  type: 'grid';
  layout: [number, number][];
}

export interface IFlexStyle {
  type: 'flex';
  layout: [number, number][];
}

export type TStyle = IGridStyle | IFlexStyle;
