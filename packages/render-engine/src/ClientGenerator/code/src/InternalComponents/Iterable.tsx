import * as React from 'react';
import { ComponentDefinition } from '@ui-studio/types';

type Props = {
  widgetId: string;
  iteratorIndex: { [widgetId: string]: { [prop: string]: number } };
  iterator: string[];
  children?: React.ReactNode | undefined;
};

export const Iterable: ComponentDefinition = {
  key: 'iterable',
  name: 'Repeating',
  category: 'Layout',
  icon: 'ViewComfy',
  hasChildren: true,
  hasLayout: true,
  config: [
    {
      defaultValue: '',
      key: 'iterator',
      label: 'Iterator',
      schema: { type: 'array', items: { type: 'string' } }, // TODO support any type
      iterable: true,
    },
  ],
  component: ({ widgetId, iteratorIndex, iterator, children }: Props) => {
    const child = React.Children.toArray(children)[0] as React.ReactElement<any>;
    if (!child || !iterator) return null;
    return (
      <>
        {iterator.map((_, idx) =>
          React.cloneElement<any>(child, {
            iteratorIndex: {
              ...iteratorIndex,
              [widgetId]: { iterator: idx },
            },
          }),
        )}
      </>
    );
  },
};
