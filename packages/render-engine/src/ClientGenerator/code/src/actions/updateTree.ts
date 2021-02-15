import { Widget, Variable, Page, Layout } from 'canvas-types';

import { KeyedObject } from '../types/store';

export interface UpdateTree {
  type: 'UPDATE_TREE';
  payload: {
    widgets: KeyedObject<Widget>;
    pages: KeyedObject<Page>;
    layouts: KeyedObject<Layout>;
    variables: KeyedObject<Variable>;
  };
}

export const UPDATE_TREE = 'UPDATE_TREE';

export const updateTree = (tree: {
  widgets: KeyedObject<Widget>;
  pages: KeyedObject<Page>;
  layouts: KeyedObject<Layout>;
  variables: KeyedObject<Variable>;
}): UpdateTree => ({
  type: UPDATE_TREE,
  payload: tree,
});
