import { GridLayout } from './grid';
import { FlexLayout } from './flex';
import { TStyle, IRootStyle } from './style';

export interface Widget {
  id: string;
  type: 'widget';
  name: string;
  parent: string;
  component: string;
  library: string;
  props: { [key: string]: {
    mode: 'input' | 'function' | 'widget';
    value: any;
  }};
  position: number;
  style: TStyle;
}

export type Layout = GridLayout | FlexLayout;

export interface Page {
  id: string;
  type: 'page';
  name: string;
  props: { [key: string]: any };
  style: IRootStyle;
}

export interface IOverlay {
  id: string;
  type: 'overlay';
  overlayType: 'modal' | 'drawer';
  name: string;
  style: IRootStyle;
}

export type Element = Page | IOverlay | Layout | Widget;

export interface ElementTreeNode {
  id: string;
  name: string;
  position: number;
  type: 'page' | 'layout' | 'widget';
  element: Element;
  children: ElementTreeNode[];
}
