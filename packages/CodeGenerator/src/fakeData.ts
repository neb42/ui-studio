import { Widget, Layout, Page, Variable } from '@ui-builder/types';

const page1ID = '5388a8ec-a2ba-4691-a06e-e4c3046ada5e';
const grid1ID = '48bb7463-6012-46f5-939d-36011d19a56e';
const flex1ID = '378bf8cd-cb06-459d-86b5-cf96189d8b1a';
const flex2ID = '780eb6cc-cbc3-4536-a8b0-9257fc9ce3f3';
const widget1ID = '23d03543-28c9-4cae-b0c9-5507bddf999e';
const widget2ID = 'e2945925-3572-423f-9012-78c32528ea10';
const widget3ID = '86532f22-ce50-4966-9721-a7b02c3521dd';
const widget4ID = '12c5968e-881f-4cfb-94b8-5b9eea59e9de';
const variable1ID = '6f217bb5-c3fd-4649-82b8-f52868c3e770';
const variable2ID = '7153b954-5413-4d38-9149-8d786aeb58e2';
const variable3ID = 'd75804bf-6e6c-474a-bdf3-7633138ecf54';

const massage = (o: any[]) => o.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});

export const pages: { [key: string]: Page } = massage([
  { id: page1ID, type: 'page', name: 'p_page1', props: {}, style: { css: '' } },
]);

export const layouts: { [key: string]: Layout } = massage([
  {
    id: grid1ID,
    type: 'layout',
    layoutType: 'grid',
    name: 'l_grid1',
    position: 0,
    parent: page1ID,
    props: {
      rows: [
        { value: null, unit: 'auto' },
        { value: 1, unit: 'fr' },
      ],
      columns: [
        { value: null, unit: 'auto' },
        { value: 1, unit: 'fr' },
      ],
    },
    style: { type: 'page', css: '' },
  },
  {
    id: flex1ID,
    type: 'layout',
    layoutType: 'flex',
    name: 'l_flex1',
    position: 1,
    parent: grid1ID,
    props: {},
    style: {
      type: 'grid',
      css: '',
      layout: [
        [1, 1],
        [2, 1],
      ],
    },
  },
  {
    id: flex2ID,
    type: 'layout',
    layoutType: 'flex',
    name: 'l_flex2',
    position: 2,
    parent: grid1ID,
    props: {},
    style: {
      type: 'grid',
      css: '',
      layout: [
        [1, 2],
        [2, 2],
      ],
    },
  },
]);

export const widgets: { [key: string]: Widget } = massage([
  {
    id: widget1ID,
    type: 'widget',
    name: 'w_widget1',
    parent: flex1ID,
    component: 'Text',
    library: 'custom',
    position: 0,
    props: { children: { mode: 'static', value: 'widget one' } },
    events: {},
    style: { type: 'flex', css: '' },
  },
  {
    id: widget2ID,
    type: 'widget',
    name: 'w_widget2',
    parent: flex1ID,
    library: 'custom',
    position: 1,
    component: 'Text',
    props: { children: { mode: 'static', value: 'widget two' } },
    events: {},
    style: { type: 'flex', css: '' },
  },
  {
    id: widget3ID,
    type: 'widget',
    name: 'w_widget3',
    parent: flex2ID,
    library: 'custom',
    position: 0,
    component: 'Text',
    props: { children: { mode: 'static', value: 'widget three' } },
    events: {},
    style: { type: 'flex', css: '' },
  },
  {
    id: widget4ID,
    type: 'widget',
    name: 'w_widget4',
    parent: flex2ID,
    library: 'custom',
    position: 1,
    component: 'Text',
    props: { children: { mode: 'static', value: 'widget four' } },
    events: {},
    style: { type: 'flex', css: '' },
  },
]);

export const variables: { [key: string]: Variable } = massage([
  {
    id: variable1ID,
    name: 'Variable 1',
    type: 'static',
    value: 'value 1',
  },
  {
    id: variable2ID,
    name: 'Variable 2',
    type: 'function',
    functionId: 'function-1',
    trigger: 'auto',
    args: [
      { type: 'static', value: 'arg 1' },
      { type: 'variable', variableId: variable1ID },
      { type: 'widget', widgetId: widget1ID, property: 'widgetProperty' },
    ],
  },
  {
    id: variable3ID,
    name: 'Variable 3',
    type: 'function',
    functionId: 'function-2',
    trigger: 'event',
    args: [
      { type: 'static', value: 'arg 1' },
      { type: 'variable', variableId: variable1ID },
      { type: 'widget', widgetId: widget1ID, property: 'widgetProperty' },
    ],
  },
]);

export const source = '/Users/bmcalindin/workspace/ui-builder/packages/ExampleApp';
