import { ComponentDefinition } from '@ui-studio/types';

export const parseComponents = (
  components: ComponentDefinition[],
): Record<string, ComponentDefinition> =>
  components.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.key]: cur,
    }),
    {},
  );
