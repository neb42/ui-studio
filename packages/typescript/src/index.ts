import { Component } from '@ui-studio/types';

export const parseComponents = (
  components: (Component & {
    component: any;
  })[],
): Record<
  string,
  Component & {
    component: any;
  }
> =>
  components.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.key]: cur,
    }),
    {},
  );
