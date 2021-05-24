export type GridAlignment = 'auto' | 'start' | 'end' | 'center' | 'stretch';

export type FlexAlignment = 'auto' | 'start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
export type FlexJustification = 'auto' | 'start' | 'flex-end' | 'center' | 'space-between';

export type StyleProperties = {
  backgroundColor?: string | null;
  overflow: 'visible' | 'hidden' | 'auto' | 'scroll';
};

export interface BaseStyle {
  type: 'base';
  css: string;
  classNames: string;
  properties: StyleProperties;
}

export type TGridStyleLayout = [[number, number], [number, number]];

export interface IGridStyle {
  type: 'grid';
  layout: TGridStyleLayout;
  rowAlignment: GridAlignment;
  columnAlignment: GridAlignment;
  css: string;
  classNames: string;
  properties: StyleProperties;
}

export interface IFlexStyle {
  type: 'flex';
  align: FlexAlignment;
  grow: number;
  css: string;
  classNames: string;
  properties: StyleProperties;
}

export type TStyle = BaseStyle | IGridStyle | IFlexStyle;
