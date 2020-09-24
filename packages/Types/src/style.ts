export interface IGridStyle {
  type: 'grid';
  layout: [number, number][];
}

export interface IFlexStyle {
  type: 'flex';
}

export interface IPageStyle {
  type: 'page';
}

export type TStyle = IGridStyle | IFlexStyle | IPageStyle;
