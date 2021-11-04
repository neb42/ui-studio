import * as React from 'react';
import { ComponentDefinition } from '@ui-studio/types';

type Props = {
  text: string;
};

export const Text: ComponentDefinition = {
  key: 'Text',
  name: 'Text',
  category: 'Text',
  icon: 'TextFieldsSharp',
  config: [{ key: 'text', label: 'Text', schema: { type: 'string' }, defaultValue: '' }],
  component: ({ text }: Props) => <span>{text}</span>,
};
