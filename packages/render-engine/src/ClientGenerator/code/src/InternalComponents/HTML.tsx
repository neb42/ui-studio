import * as React from 'react';
import { ComponentDefinition } from '@ui-studio/types';

type Props = {
  html: string;
};

export const HTML: ComponentDefinition = {
  key: 'html',
  name: 'HTML',
  category: 'Text',
  icon: 'Code',
  config: [
    {
      defaultValue: '<div></div>',
      key: 'html',
      label: 'HTML',
      schema: { type: 'string' },
    },
  ],
  component: ({ html }: Props) => <div dangerouslySetInnerHTML={{ __html: html }} />,
};
