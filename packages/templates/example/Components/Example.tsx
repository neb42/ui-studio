import * as React from 'react';
import { Component } from '@ui-studio/types';

const Example: Component & { component: any } = {
  key: 'Example',
  name: 'Example',
  library: '',
  category: 'Examples',
  icon: 'Help',
  hasChildren: false,
  hasLayout: false,
  events: [{ key: 'onClick', label: 'Example event' }],
  config: [
    {
      key: 'input',
      label: 'Input',
      defaultValue: 'Default input value',
      schema: { type: 'string' },
    },
    {
      key: 'list',
      label: 'List',
      defaultValue: 'Default list value',
      schema: { type: 'array', items: { type: 'string' } },
    },
    {
      key: 'complex',
      label: 'Complex',
      defaultValue: {
        complexInput: 'Default complex input',
        complexSelect: 'Option 2',
      },
      schema: {
        type: 'object',
        properties: {
          complexInput: { type: 'string' },
          complexSelect: { type: 'string', enum: ['Option 1', 'Option 2'] },
        },
      },
    },
    {
      key: 'complexList',
      label: 'Complex list',
      defaultValue: {
        complexInput: 'Default complex input',
        complexSelect: 'Option 2',
      },
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            complexInput: { type: 'string' },
            complexSelect: { type: 'string', enum: ['Option 1', 'Option 2'] },
          },
        },
      },
    },
  ],
  exposedProperties: [
    { property: 'exampleProperty', schema: { type: 'string' } },
    { property: 'clickCount', schema: { type: 'number' } },
  ],
  component: ({ onClick, list, complex, input, complexList, onExposedPropertiesChange }: any) => {
    const [clickCount, setClickCount] = React.useState(0);

    React.useEffect(() => {
      onExposedPropertiesChange({
        exampleProperty: 'An example exposed property',
        clickCount,
      });
    }, [clickCount]);

    const handleOnClick = () => {
      setClickCount(clickCount + 1);
      onClick();
    };

    const json = (() => {
      try {
        return JSON.stringify(
          {
            list,
            complex,
            input,
            complexList,
          },
          null,
          2,
        );
      } catch {
        return 'Error parsing json';
      }
    })();

    return (
      <div>
        <div onClick={handleOnClick}>Click me</div>
        <pre>
          <code>{json}</code>
        </pre>
      </div>
    );
  },
};

export default Example