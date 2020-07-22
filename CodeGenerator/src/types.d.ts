interface Dependencies {
  queries: Query[];
  serverFunctions: ServerFunction[];
  clientFunctions: ClientFunction[];
  widgets: Widget[];
}

interface Dataset {
  type: 'dataset';
  name: string;
  dependencies: Dependencies;
}

interface Query {
  type: 'query';
  name: string;
  dataset: Dataset;
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
  dependencies: Dependencies;
}

interface Layout {
  type: 'layout';
  layoutType: 'grid' | 'flex';
  name: string;
  dependencies: Dependencies;
}

interface Node {
  type: 'layout' | 'widget';
  name: string;
  children: Node[];
}

interface Page {
  type: 'page';
  name: string;
  children: Node[];
}