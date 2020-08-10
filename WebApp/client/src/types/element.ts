export interface Dependencies {
  queries: string[];
  serverFunctions: string[];
  clientFunctions: string[];
  widgets: string[];
}

export interface Widget {
  type: 'widget';
  name: string;
  parent: string;
  component: 'text';
  dependencies: Dependencies;
  props: { [key: string]: any };
}

export interface Layout {
  type: 'layout';
  layoutType: 'grid' | 'flex';
  name: string;
  parent: string;
  dependencies: Dependencies;
  props: { [key: string]: any };
}

export interface Page {
  type: 'page';
  name: string;
  props: { [key: string]: any };
}

export interface ElementTreeNode {
  name: string;
  type: 'page' | 'layout' | 'widget';
  children: ElementTreeNode[];
}
