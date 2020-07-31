type GetChildrenOfTypes = (nodeKey: string, types: ('widget' | 'layout' | 'clientFunction' | 'serverFunction' | 'query' | 'dataset')[]) => string[];

interface Dependencies {
  queries: string[];
  serverFunctions: string[];
  clientFunctions: string[];
  widgets: string[];
}

interface Dataset {
  type: 'dataset';
  name: string;
}

interface Query {
  type: 'query';
  name: string;
  dataset: string;
  queryString: string;
  dependencies: Dependencies;
}

interface ServerFunction {
  type: 'serverFunction';
  name: string;
  dependencies: Dependencies;
  functionString: string;
}

interface ClientFunction {
  type: 'clientFunction';
  name: string;
  dependencies: Dependencies;
  functionString: string;
}

interface Widget {
  type: 'widget';
  name: string;
  parent: string;
  component: string;
  dependencies: Dependencies;
}

interface Layout {
  type: 'layout';
  layoutType: 'grid' | 'flex';
  name: string;
  parent: string;
  dependencies: Dependencies;
}

interface Page {
  type: 'page';
  name: string;
}

interface ElementTree {
  name: string;
  type: 'page' | 'layout' | 'widget';
  children: ElementTree[];
}