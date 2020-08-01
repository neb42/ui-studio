const emptyDeps: Dependencies = {
  queries: [],
  serverFunctions: [],
  clientFunctions: [],
  widgets: [],
};

const datasetTable: Dataset[] = [
  { type: 'dataset', name: 'd_dataset1', host: 'wyqk6x041tfxg39e.chr7pe7iynqr.eu-west-1.rds.amazonaws.com', port: 3306, user: 'ijgu2hm7ysgtu42l', password: 'pb8ra7vvrvolyifr', database: 'yksyaelyn0at98gk' },
];
const queryTable: Query[] = [
  { type: 'query', name: 'q_query1', queryString: '', dataset: 'd_dataset1', dependencies: { ...emptyDeps, serverFunctions: ['f_serverFunc1'] }},
];
const serverFunctionTable: ServerFunction[] = [
  { type: 'serverFunction', name: 'f_serverFunc1', functionString: '', dependencies: { ...emptyDeps, clientFunctions: ['f_clientFunc1'] }},
  { type: 'serverFunction', name: 'f_serverFunc2', functionString: '', dependencies: { ...emptyDeps, widgets: ['w_widget1'], queries:['q_query1'] }},
];
const clientFunctionTable: ClientFunction[] = [
  { type: 'clientFunction', name: 'f_clientFunc1', functionString: '', dependencies: { ...emptyDeps, widgets: ['w_widget2'] }},
  { type: 'clientFunction', name: 'f_clientFunc2', functionString: '', dependencies: emptyDeps },
];
const widgetTable: Widget[] = [
  { type: 'widget', name: 'w_widget1', parent: 'l_flex1', component: 'text', dependencies: emptyDeps },
  { type: 'widget', name: 'w_widget2', parent: 'l_flex1', component: 'text', dependencies: emptyDeps },
  { type: 'widget', name: 'w_widget3', parent: 'l_flex2', component: 'text', dependencies: { ...emptyDeps, queries: ['q_query1'] }},
  { type: 'widget', name: 'w_widget4', parent: 'l_grid1', component: 'text', dependencies: { ...emptyDeps, clientFunctions: ['f_clientFunc2'], serverFunctions: ['f_serverFunc1'] }},
];
const layoutTable: Layout[] = [
  { type: 'layout', layoutType: 'grid', name: 'l_grid1', parent: 'p_page1', dependencies: emptyDeps },
  { type: 'layout', layoutType: 'flex', name: 'l_flex1', parent: 'l_grid1', dependencies: emptyDeps },
  { type: 'layout', layoutType: 'flex', name: 'l_flex2', parent: 'l_grid1', dependencies: emptyDeps },
];
const pageTable: Page[] = [
  { type: 'page', name: 'p_page1' },
];

const massage = (o: any[]) => o.reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});

export const dataset = massage(datasetTable);
export const queries = massage(queryTable);
export const serverFunctions = massage(serverFunctionTable);
export const clientFunctions = massage(clientFunctionTable);
export const widgets = massage(widgetTable);
export const layouts = massage(layoutTable);
export const pages = massage(pageTable);