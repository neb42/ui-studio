import * as React from 'react';
import { Component } from 'canvas-types';

export const Layout: Component & { component: any } = {
  key: 'layout',
  name: 'Layout',
  category: 'Internal',
  library: 'internal',
  icon: 'DashboardSharp',
  hasChildren: true,
  hasLayout: true,
  component: ({ children }: any) => children,
};
