import * as React from 'react';
import { Component } from '@ui-studio/types';

export const Iterable: Component & { component: any } = {
  key: 'iterable',
  name: 'Repeating',
  category: 'Layout',
  library: 'internal',
  icon: 'ViewComfy',
  hasChildren: true,
  hasLayout: true,
  config: [
    {
      component: 'input',
      type: 'object',
      defaultValue: '[]',
      key: 'iterator',
      label: 'Iterator',
      iterable: true,
    },
  ],
  component: ({
    widgetId,
    iteratorIndex,
    iterator,
    children,
  }: {
    widgetId: string;
    iteratorIndex: { [widgetId: string]: { [prop: string]: number } };
    iterator: any[];
    children: any;
  }) => {
    const child = React.Children.toArray(children)[0] as React.ReactElement<any>;
    if (!child || !iterator) return null;
    return iterator.map((_, idx) =>
      React.cloneElement<any>(child, {
        iteratorIndex: {
          ...iteratorIndex,
          [widgetId]: { iterator: idx },
        },
      }),
    );
  },
};
