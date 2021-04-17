import * as React from 'react';
import { Component } from '@ui-studio/types';

export const Conditional: Component & { component: any } = {
  key: 'conditional-renderer',
  name: 'Conditional',
  category: 'Internal',
  library: 'internal',
  icon: 'HdrWeak',
  hasChildren: true,
  hasLayout: true,
  config: [
    {
      component: 'input',
      type: 'number',
      defaultValue: 0,
      key: 'activeIdx',
      label: 'Active index',
    },
  ],
  component: ({ activeIdx, children }: any) => {
    const child = React.Children.toArray(children)[activeIdx];
    return child || null;
  },
};
