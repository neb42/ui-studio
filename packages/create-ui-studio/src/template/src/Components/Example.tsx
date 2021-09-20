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
        complexInput: { mode: 'static', value: 'Default complex input' },
        complexSelect: { mode: 'static', value: 'Option 2' },
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
        complexInput: { mode: 'static', value: 'Default complex input' },
        complexSelect: { mode: 'static', value: 'Option 2' },
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
