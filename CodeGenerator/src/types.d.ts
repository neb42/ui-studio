interface Dependencies {
  queries: Query[];
  serverFunctions: ServerFunction[];
  clientFunctions: ClientFunction[];
  components: Component[];
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

interface Component {
  type: 'component';
  name: string;
  dependencies: Dependencies;
}

interface Layout {
  type: 'layout';
  name: string;
  dependencies: Dependencies;
  children: Component[];
}