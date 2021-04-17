import * as React from 'react';
import { Component } from '@ui-studio/types';

export const Example: Component & { component: any } = {
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
      component: 'input',
      key: 'input',
      label: 'Input',
      type: 'string',
      list: false,
      defaultValue: 'Default input value',
    },
    {
      component: 'input',
      key: 'list',
      label: 'List',
      type: 'string',
      list: true,
      defaultValue: 'Default list value',
    },
    {
      component: 'complex',
      key: 'complex',
      label: 'Complex',
      config: [
        {
          component: 'input',
          key: 'complexInput',
          label: 'Complex input',
          list: false,
          type: 'string',
          defaultValue: 'Default complex input',
        },
        {
          component: 'select',
          options: [
            { key: 'option-1', label: 'Option 1' },
            { key: 'option-2', label: 'Option 2' },
          ],
          defaultValue: 'option-2',
          key: 'complexSelect',
          label: 'Complex select',
          type: 'string',
        },
      ],
    },
    {
      component: 'complex',
      key: 'complexList',
      label: 'Complex list',
      list: true,
      config: [
        {
          component: 'input',
          key: 'complexInput',
          label: 'Complex input',
          type: 'string',
          defaultValue: 'Default complex input',
        },
        {
          component: 'select',
          options: [
            { key: 'option-1', label: 'Option 1' },
            { key: 'option-2', label: 'Option 2' },
          ],
          defaultValue: 'option-2',
          key: 'complexSelect',
          label: 'Complex select',
          type: 'string',
        },
      ],
    },
  ],
  exposedProperties: ['exampleProperty'],
  component: ({ onClick, list, complex, input, complexList }: any) => {
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
        <div onClick={onClick}>Click me</div>
        <pre>
          <code>{json}</code>
        </pre>
      </div>
    );
  },
};
