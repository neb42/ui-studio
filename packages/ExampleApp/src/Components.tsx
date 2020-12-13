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
    { component: 'input', key: 'text', label: 'Text' },
  ],
  component: ({ text }) => <span>{text}</span>,
};

export default {
  Text,
};