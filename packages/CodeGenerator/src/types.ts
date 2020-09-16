export type GetChildrenOfTypes = (
  nodeKey: string,
  types: ('widget' | 'layout' | 'clientFunction' | 'serverFunction' | 'query' | 'dataset')[],
) => string[];

export interface Dependencies {
  queries: string[];
  serverFunctions: string[];
  clientFunctions: string[];
  widgets: string[];
}

export interface Dataset {
  id: string;
  type: 'dataset';
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface Query {
  id: string;
  type: 'query';
  name: string;
  dataset: string;
  queryString: string;
  dependencies: Dependencies;
}

export interface ServerFunction {
  id: string;
  type: 'serverFunction';
  name: string;
  dependencies: Dependencies;
  functionString: string;
}

export interface ClientFunction {
  id: string;
  type: 'clientFunction';
  name: string;
  dependencies: Dependencies;
  functionString: string;
}

export interface Widget {
  id: string;
  type: 'widget';
  name: string;
  parent: string;
  component: string;
  dependencies: Dependencies;
  props: { [key: string]: any };
}

export interface Layout {
  id: string;
  type: 'layout';
  layoutType: 'grid' | 'flex';
  name: string;
  parent: string;
  dependencies: Dependencies;
}

export interface Page {
  id: string;
  type: 'page';
  name: string;
}

export interface ElementTree {
  id: string;
  name: string;
  type: 'page' | 'layout' | 'widget';
  children: ElementTree[];
}
