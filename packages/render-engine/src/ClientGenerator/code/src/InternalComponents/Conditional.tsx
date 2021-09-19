import * as React from 'react';
import { Component } from '@ui-studio/types';

export const Conditional: Component & { component: any } = {
  key: 'conditional-renderer',
  name: 'Conditional',
  category: 'Layout',
  library: 'internal',
  icon: 'HdrWeak',
  hasChildren: true,
  hasLayout: true,
  config: [
    {
      defaultValue: 0,
      key: 'activeIdx',
      label: 'Active index',
      schema: { type: 'number' },
    },
  ],
  component: ({ activeIdx, children }: any) => {
    const child = React.Children.toArray(children)[activeIdx];
    return child || null;
  },
};
