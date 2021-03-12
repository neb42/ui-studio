import * as React from 'react';

const Example = {
  name: '',
  description: '',
  category: '',
  icon: '',
  hasChildren: false,
  events: [{ key: 'onClick', label: 'Example event' }],
  config: [
    { component: 'input', key: 'exampleInput', label: 'Example input', type: 'string' },
    {
      component: 'select',
      options: [{ key: 'example', value: 'Example' }],
      key: 'exampleSelect',
      label: 'Example select',
      type: 'string',
    },
  ],
  exposedProperties: ['exampleProperty'],
  component: ({ onClick, exampleInput, exampleSelect }) => <div />,
};

export default {
  // Example,
};
