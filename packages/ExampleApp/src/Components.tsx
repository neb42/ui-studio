import * as React from 'react';
import Typography from '@faculty/adler-web-components/atoms/Typography';

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
    { component: 'select', options: [], key: 'type', label: 'Type' },
    { component: 'select', options: [], key: 'subtype', label: 'Subtype' },
  ],
  // component: ({ type, subtype, children }) => <Typography type={type} subtype={subtype}>{children}</Typography>,
  component: ({ children }) => <span>{children}</span>,
};

export default {
  Text,
};