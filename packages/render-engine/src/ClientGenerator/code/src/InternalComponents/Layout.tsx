import * as React from 'react';
import { ComponentDefinition } from '@ui-studio/types';

type Props = {
  children?: React.ReactNode | undefined;
};

export const Layout: ComponentDefinition = {
  key: 'layout',
  name: 'Layout',
  category: 'Layout',
  icon: 'DashboardSharp',
  hasChildren: true,
  hasLayout: true,
  component: ({ children }: Props) => children,
};
