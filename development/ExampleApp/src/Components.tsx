import * as React from 'react';

const T: React.FunctionComponent<any> = () => {
  const [a, setA] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => setA(true), 5000);
  }, []);
  return React.createElement('div', null, a ? 'aaa' : 'bbb');
};

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
  component: ({ text, onClick }) => {
    const [t, setT] = React.useState('foo')
    return <span onClick={onClick}>{text} {t}</span>;
  },
  // component: T,
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