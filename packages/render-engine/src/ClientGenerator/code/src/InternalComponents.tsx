import * as React from 'react';
import { Component } from 'canvas-types';

export const Layout: Component & { component: any } = {
  name: 'Layout',
  description: '',
  category: 'Layout',
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
  category: 'Layout',
  library: 'internal',
  icon: 'HelpSharp',
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
    },
  ],
  component: ({ activeIdx, children }: any) => {
    const child = React.Children.toArray(children)[activeIdx];
    return child || null;
  },
};
