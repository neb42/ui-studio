import * as React from 'react';
import { Component } from 'canvas-types';

export const Layout: Component & { component: any } = {
  name: 'Layout',
  description: '',
  category: 'Internal',
  library: 'internal',
  icon: 'DashboardSharp',
  hasChildren: true,
  hasLayout: true,
  exposedProperties: [],
  events: [],
  config: [],
  component: ({ children }: any) => children,
};

export const Conditional: Component & { component: any } = {
  name: 'Conditional',
  description: '',
  category: 'Internal',
  library: 'internal',
  icon: 'HdrWeak',
  hasChildren: true,
  hasLayout: true,
  exposedProperties: [],
  events: [],
  config: [
    {
      component: 'input',
      type: 'number',
      defaultValue: 0,
      key: 'activeIdx',
      label: 'Active index',
      list: false,
      iterable: false,
    },
  ],
  component: ({ activeIdx, children }: any) => {
    const child = React.Children.toArray(children)[activeIdx];
    return child || null;
  },
};

export const Iterable: Component & { component: any } = {
  name: 'Iterable',
  description: '',
  category: 'Internal',
  library: 'internal',
  icon: 'ViewComfy',
  hasChildren: true,
  hasLayout: true,
  exposedProperties: [],
  events: [],
  config: [
    {
      component: 'input',
      type: 'object',
      defaultValue: '[]',
      key: 'iterator',
      label: 'Iterator',
      list: false,
      iterable: true,
    },
  ],
  component: ({
    widgetId,
    iteratorIndex,
    iterator,
    children,
  }: {
    widgetId: string;
    iteratorIndex: { [widgetId: string]: { [prop: string]: number } };
    iterator: any[];
    children: any;
  }) => {
    const child = React.Children.toArray(children)[0] as React.ReactElement<any>;
    if (!child || !iterator) return null;
    return iterator.map((_, idx) =>
      React.cloneElement<any>(child, {
        iteratorIndex: {
          ...iteratorIndex,
          [widgetId]: { iterator: idx },
        },
      }),
    );
  },
};

export const HTML: Component & { component: any } = {
  name: 'HTML',
  description: '',
  category: 'Internal',
  library: 'internal',
  icon: 'Code',
  hasChildren: false,
  hasLayout: false,
  exposedProperties: [],
  events: [],
  config: [
    {
      component: 'input',
      type: 'string',
      defaultValue: '<div></div>',
      key: 'html',
      label: 'HTML',
      list: false,
      iterable: false,
    },
  ],
  component: ({ html }: { html: string }) => <div dangerouslySetInnerHTML={{ __html: html }} />,
};
