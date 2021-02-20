export type GridAlignment = 'start' | 'end' | 'center' | 'stretch';

export type FlexAlignment = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
export type FlexJustification = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'space-between';

export interface BaseStyle {
  type: 'base';
  css: string;
  classNames: string;
}

export type TGridStyleLayout = [[number, number], [number, number]];

export interface IGridStyle {
  type: 'grid';
  layout: TGridStyleLayout;
  rowAlignment: GridAlignment;
  columnAlignment: GridAlignment;
  css: string;
  classNames: string;
}

export interface IFlexStyle {
  type: 'flex';
  align: FlexAlignment;
  justify: FlexJustification;
  grow: number;
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
