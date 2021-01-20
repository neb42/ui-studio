import { IRootStyle } from './style';
import { Layout } from './layout';
import { Widget } from './widget';

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
