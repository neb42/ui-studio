import * as React from 'react';
import { Component } from '@ui-studio/types';

export const HTML: Component & { component: any } = {
  key: 'html',
  name: 'HTML',
  category: 'Text',
  library: 'internal',
  icon: 'Code',
  config: [
    {
      defaultValue: '<div></div>',
      key: 'html',
      label: 'HTML',
      schema: { type: 'string' },
    },
  ],
  component: ({ html }: { html: string }) => <div dangerouslySetInnerHTML={{ __html: html }} />,
};
