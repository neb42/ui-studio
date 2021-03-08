import * as React from 'react';
import { Component } from 'canvas-types';

export const Layout: Component & { component: React.FC } = {
  name: 'Layout',
  description: '',
  category: 'Internal',
  library: 'internal',
  icon: 'GridOnSharp',
  hasChildren: true,
  hasLayout: true,
  exposedProperties: [],
  events: [],
  config: [],
  component: ({ children }) => <>{children}</>,
};
