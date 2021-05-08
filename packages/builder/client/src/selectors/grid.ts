import { TGridStyleLayout } from '@ui-studio/types';
import { getElement, getWidgetsForRoot, getParentElement } from 'selectors/tree';
import { getSelectedRootId, getSelectedElementId } from 'selectors/view';
import { Store } from 'types/store';

export const getUsedGridSpace = (
  state: Store,
  rootId: string,
  gridElementId: string,
  ignoreIds: string[],
): TGridStyleLayout[] => {
  const notEmpty = <T>(value: T | null | undefined): value is T => {
    return value !== null && value !== undefined;
  };
  const widgets = getWidgetsForRoot(state, rootId);
  const grid = getElement(state, rootId, gridElementId);
  if (!grid) throw Error();
  return widgets
    .filter((e) => e.parent === grid.id && !ignoreIds.includes(e.id))
    .map((e) => {
      if (e.style.type === 'grid') return e.style.layout;
      return null;
    })
    .filter(notEmpty);
};

export const getUsedGridSpaceForSelectedElement = (state: Store): TGridStyleLayout[] => {
  const rootId = getSelectedRootId(state);
  const selectedElementId = getSelectedElementId(state);
  if (!rootId || !selectedElementId) throw Error();
  const parent = getParentElement(state, rootId, selectedElementId);
  if (!parent || parent.rootElement || parent.layout?.type !== 'grid') throw Error();
  return getUsedGridSpace(state, rootId, parent.id, [selectedElementId]);
};
