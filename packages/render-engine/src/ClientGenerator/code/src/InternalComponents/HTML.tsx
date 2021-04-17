import * as React from 'react';
import { Component } from '@ui-studio/types';

export const HTML: Component & { component: any } = {
  key: 'html',
  name: 'HTML',
  category: 'Internal',
  library: 'internal',
  icon: 'Code',
  config: [
    {
      component: 'input',
      type: 'string',
      defaultValue: '<div></div>',
      key: 'html',
      label: 'HTML',
    },
  ],
  component: ({ html }: { html: string }) => <div dangerouslySetInnerHTML={{ __html: html }} />,
};
