import { BaseStyle } from './style';
import { Widget } from './widget';
import { CustomComponent, CustomComponentInstance } from './customComponent';

export interface Page {
  id: string;
  rootElement: true;
  type: 'page';
  name: string;
  props: { [key: string]: any };
  style: BaseStyle;
}

export type Element = Page | Widget | CustomComponent | CustomComponentInstance;

export interface ElementTreeNode {
  id: string;
  name: string;
  position: number;
  type: Element['type'];
  element: Element;
  children: ElementTreeNode[];
}
