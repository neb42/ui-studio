export interface BaseStyle {
  type: 'base';
  css: string;
  classNames: string;
}

export type TGridStyleLayout = [[number, number], [number, number]];

export interface IGridStyle {
  type: 'grid';
  layout: TGridStyleLayout;
  css: string;
  classNames: string;
}

export interface IFlexStyle {
  type: 'flex';
  css: string;
  classNames: string;
}

export interface IPageStyle {
  type: 'page';
  css: string;
  classNames: string;
}

export interface IRootStyle {
  css: string;
  classNames: string;
}

export type TStyle = BaseStyle | IGridStyle | IFlexStyle | IPageStyle;
