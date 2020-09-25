export type TGridStyleLayout = [[number, number], [number, number]];

export interface IGridStyle {
  type: 'grid';
  layout: TGridStyleLayout;
}

export interface IFlexStyle {
  type: 'flex';
}

export interface IPageStyle {
  type: 'page';
}

export type TStyle = IGridStyle | IFlexStyle | IPageStyle;
