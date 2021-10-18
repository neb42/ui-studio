import * as React from 'react';
import { Component } from '@ui-studio/types';

export const Text: Component & { component: any } = {
  key: 'Text',
  name: 'Text',
  category: 'Text',
  icon: 'TextFieldsSharp',
  library: 'internal',
  config: [{ key: 'text', label: 'Text', schema: { type: 'string' }, defaultValue: '' }],
  component: ({ text }: { text: string }) => <span>{text}</span>,
};
