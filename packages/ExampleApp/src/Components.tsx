import * as React from 'react';

const Text = {
  name: 'Text',
  description: '',
  category: 'Typography',
  icon: 'TextFieldsSharp',
  defaultProps: {
    type: '',
    subtype: '',
    children: '',
  },
  config: [
    { component: 'input', key: 'children', label: 'Text' },
  ],
  component: ({ children }) => <span>{children}</span>,
};

export default {
  Text,
};