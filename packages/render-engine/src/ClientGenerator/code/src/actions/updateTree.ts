import { Widget, Variable, Page, CustomComponent, CustomComponentInstance } from '@ui-studio/types';

import { KeyedObject } from '../types/store';

export interface UpdateTree {
  type: 'UPDATE_TREE';
  payload: {
    tree: KeyedObject<{
      root: Page | CustomComponent;
      widgets: KeyedObject<Widget | CustomComponentInstance>;
    }>;
    variables: KeyedObject<Variable>;
  };
}

export const UPDATE_TREE = 'UPDATE_TREE';

export const updateTree = (tree: {
  tree: KeyedObject<{
    root: Page | CustomComponent;
    widgets: KeyedObject<Widget | CustomComponentInstance>;
  }>;
  variables: KeyedObject<Variable>;
}): UpdateTree => ({
  type: UPDATE_TREE,
  payload: tree,
});
