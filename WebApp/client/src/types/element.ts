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
  component: string;
  dependencies: Dependencies;
}

export interface Layout {
  type: 'layout';
  layoutType: 'grid' | 'flex';
  name: string;
  parent: string;
  dependencies: Dependencies;
}

export interface Page {
  type: 'page';
  name: string;
}

export interface ElementTree {
  name: string;
  type: 'page' | 'layout' | 'widget';
  children: ElementTree[];
}
