import { GridLayout } from './grid';
import { FlexLayout } from './flex';
import { TStyle } from './style';

export interface Dependencies {
  queries: string[];
  serverFunctions: string[];
  clientFunctions: string[];
  widgets: string[];
}

export interface Widget {
  id: string;
  type: 'widget';
  name: string;
  parent: string;
  component: 'text';
  dependencies: Dependencies;
  props: { [key: string]: any };
  style: TStyle;
}

export type Layout = GridLayout | FlexLayout;

export interface Page {
  id: string;
  type: 'page';
  name: string;
  props: { [key: string]: any };
}

export interface ElementTreeNode {
  id: string;
  name: string;
  type: 'page' | 'layout' | 'widget';
  children: ElementTreeNode[];
}
