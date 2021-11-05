import * as React from 'react';
import { ComponentDefinition } from '@ui-studio/types';

type Props = {
  activeIdx: number;
  children?: React.ReactNode | undefined;
};

export const Conditional: ComponentDefinition = {
  key: 'conditional-renderer',
  name: 'Conditional',
  category: 'Layout',
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
  component: ({ activeIdx, children }: Props) => {
    const child = React.Children.toArray(children)[activeIdx];
    return <>{child || null}</>;
  },
};
