import { Store, ScreenSize } from 'types/store';

export const getSelectedRootId = (state: Store): string | null => state.view.tree.rootId;

export const getSelectedElementId = (state: Store): string | null =>
  state.view.tree.selectedElementId;

export const getHoverElementId = (state: Store): string | null => state.view.tree.hoverElementId;

export const getSelectedVariableId = (state: Store): string | null =>
  state.view.variable.selectedVariableId;

export const getPreviewSize = (state: Store): ScreenSize => state.view.preview.size;

export const getSelectedView = (state: Store): 'preview' | 'variable' | 'css' =>
  state.view.selectedView;
