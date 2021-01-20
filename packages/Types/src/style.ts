export interface BaseStyle {
  type: 'base';
  css: string;
}

export type TGridStyleLayout = [[number, number], [number, number]];

export interface IGridStyle {
  type: 'grid';
  layout: TGridStyleLayout;
  css: string;
}

export interface IFlexStyle {
  type: 'flex';
  css: string;
}

export interface IPageStyle {
  type: 'page';
  css: string;
}

export interface IRootStyle {
  css: string;
}

export type TStyle = BaseStyle | IGridStyle | IFlexStyle | IPageStyle;
