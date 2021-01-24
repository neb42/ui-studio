import * as React from 'react';

const Text = {
  name: 'Text',
  description: '',
  category: 'Typography',
  icon: 'TextFieldsSharp',
  hasChildren: false,
  events: [
    { key: 'onClick', label: 'On text click' },
  ],
  config: [
    { component: 'input', key: 'text', label: 'Text', type: 'string' },
  ],
  component: ({ text, onClick }) => <span onClick={onClick}>{text}</span>,
};

const ChildRenderer = {
  name: 'ChildRenderer',
  description: '',
  category: 'Layout',
  icon: 'TextFieldsSharp',
  hasChildren: true,
  events: [
    { key: 'onClick', label: 'On text click' },
  ],
  config: [],
  component: ({ children }) => <div className="ChildRenderer">{children}</div>,
};

export default {
  Text,
  ChildRenderer,
};