import { Dependencies, Widget, Layout, Page } from '@ui-builder/types';

const emptyDeps: Dependencies = {
  queries: [],
  serverFunctions: [],
  clientFunctions: [],
  widgets: [],
};

const grid1ID = '';
const flex1ID = '';
const flex2ID = '';
const query1ID = '';
const server1ID = '';
const server2ID = '';
const clientFunc1ID = '';
const clientFunc2ID = '';
const widget1ID = '';
const widget2ID = '';
const widget3ID = '';
const widget4ID = '';

const pageTable: Page[] = [{ id: '', type: 'page', name: 'p_page1', props: {} }];

const datasetTable = [
  {
    id: '',
    type: 'dataset',
    name: 'd_dataset1',
    host: 'wyqk6x041tfxg39e.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    port: 3306,
    user: 'ijgu2hm7ysgtu42l',
    password: 'pb8ra7vvrvolyifr',
    database: 'yksyaelyn0at98gk',
  },
];

const layoutTable: Layout[] = [
  {
    id: grid1ID,
    type: 'layout',
    layoutType: 'grid',
    name: 'l_grid1',
    parent: 'p_page1',
    props: {
      rows: [
        { value: 1, unit: 'fr' },
        { value: 1, unit: 'fr' },
      ],
      columns: [
        { value: 1, unit: 'fr' },
        { value: 1, unit: 'fr' },
      ],
    },
    style: { type: 'page' },
  },
  {
    id: flex1ID,
    type: 'layout',
    layoutType: 'flex',
    name: 'l_flex1',
    parent: 'l_grid1',
    props: {},
    style: {
      type: 'grid',
      layout: [
        [0, 0],
        [0, 1],
      ],
    },
  },
  {
    id: flex2ID,
    type: 'layout',
    layoutType: 'flex',
    name: 'l_flex2',
    parent: 'l_grid1',
    props: {},
    style: {
      type: 'grid',
      layout: [
        [1, 0],
        [1, 1],
      ],
    },
  },
];

const queryTable = [
  {
    id: query1ID,
    type: 'query',
    name: 'q_query1',
    queryString: '{{ f_serverFunc1 }}',
    dataset: datasetTable[0].name,
    dependencies: { ...emptyDeps, serverFunctions: ['f_serverFunc1'] },
  },
];

const serverFunctionTable = [
  {
    id: server1ID,
    type: 'serverFunction',
    name: 'f_serverFunc1',
    functionString:
      // eslint-disable-next-line no-template-curly-in-string
      'const bar = {{ f_clientFunc1 }}; return `SELECT * FROM mydataset WHERE bar = "${bar}"`',
    dependencies: { ...emptyDeps, clientFunctions: ['f_clientFunc1'] },
  },
  {
    id: server2ID,
    type: 'serverFunction',
    name: 'f_serverFunc2',
    functionString: 'return {{ q_query1 }}[0];',
    dependencies: { ...emptyDeps, widgets: ['w_widget1'], queries: ['q_query1'] },
  },
];

const clientFunctionTable = [
  {
    id: clientFunc1ID,
    type: 'clientFunction',
    name: 'f_clientFunc1',
    functionString: 'console.log({{ w_widget2 }}); return "Hello";',
    dependencies: { ...emptyDeps, widgets: ['w_widget2'] },
  },
  {
    id: clientFunc2ID,
    type: 'clientFunction',
    name: 'f_clientFunc2',
    functionString: 'return 10;',
    dependencies: emptyDeps,
  },
];

const widgetTable: Widget[] = [
  {
    id: widget1ID,
    type: 'widget',
    name: 'w_widget1',
    parent: 'l_flex1',
    component: 'text',
    dependencies: emptyDeps,
    props: { children: 'widget one' },
    style: { type: 'flex' },
  },
  {
    id: widget2ID,
    type: 'widget',
    name: 'w_widget2',
    parent: 'l_flex1',
    component: 'text',
    dependencies: emptyDeps,
    props: { children: 'widget two' },
    style: { type: 'flex' },
  },
  {
    id: widget3ID,
    type: 'widget',
    name: 'w_widget3',
    parent: 'l_flex2',
    component: 'text',
    dependencies: { ...emptyDeps, queries: ['q_query1'] },
    props: { children: 'widget three' },
    style: { type: 'flex' },
  },
  {
    id: widget4ID,
    type: 'widget',
    name: 'w_widget4',
    parent: 'l_flex2',
    component: 'text',
    dependencies: {
      ...emptyDeps,
      clientFunctions: ['f_clientFunc1'],
      serverFunctions: ['f_serverFunc1'],
    },
    props: { children: 'widget four' },
    style: { type: 'flex' },
  },
];

const massage = (o: any[]) => o.reduce((acc, cur) => ({ ...acc, [cur.name]: cur }), {});

export const source = '/Users/bmcalindin/workspace/ui-builder/packages/ExampleApp';
export const dataset = massage(datasetTable);
export const queries = massage(queryTable);
export const serverFunctions = massage(serverFunctionTable);
export const clientFunctions = massage(clientFunctionTable);
export const widgets = massage(widgetTable);
export const layouts = massage(layoutTable);
export const pages = massage(pageTable);
