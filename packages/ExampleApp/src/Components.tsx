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
  events: [
    { key: 'onClick', label: 'On text click' },
  ],
  config: [
    { component: 'input', key: 'text', label: 'Text', type: 'string' },
  ],
  component: ({ text }) => <span>{text}</span>,
};

export default {
  Text,
};