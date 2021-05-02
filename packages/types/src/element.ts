import { BaseStyle } from './style';
import { Widget } from './widget';
import { CustomComponent } from './customComponent';

export interface Page {
  id: string;
  type: 'page';
  name: string;
  props: { [key: string]: any };
  style: BaseStyle;
}

export type Element = Page | Widget | CustomComponent;

export interface ElementTreeNode {
  id: string;
  name: string;
  position: number;
  type: 'page' | 'customComponent' | 'widget';
  element: Element;
  children: ElementTreeNode[];
}
