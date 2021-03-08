import { BaseStyle } from './style';
import { Widget } from './widget';

export interface Page {
  id: string;
  type: 'page';
  name: string;
  props: { [key: string]: any };
  style: BaseStyle;
}

export interface IOverlay {
  id: string;
  type: 'overlay';
  overlayType: 'modal' | 'drawer';
  name: string;
  style: BaseStyle;
}

export type Element = Page | IOverlay | Widget;

export interface ElementTreeNode {
  id: string;
  name: string;
  position: number;
  type: 'page' | 'layout' | 'widget';
  element: Element;
  children: ElementTreeNode[];
}
