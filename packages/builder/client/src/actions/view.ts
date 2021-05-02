import { ScreenSize } from 'types/store';

export interface SelectRootElement {
  type: 'SELECT_ROOT_ELEMENT';
  payload: {
    id: string;
  };
}

export const SELECT_ROOT_ELEMENT = 'SELECT_ROOT_ELEMENT';

export const selectRootElement = (id: string): SelectRootElement => ({
  type: SELECT_ROOT_ELEMENT,
  payload: { id },
});

export interface SelectElement {
  type: 'SELECT_ELEMENT';
  payload: string | null;
}

export const SELECT_ELEMENT = 'SELECT_ELEMENT';

export const selectElement = (id: string | null): SelectElement => ({
  type: SELECT_ELEMENT,
  payload: id,
});

export interface HoverElement {
  type: 'HOVER_ELEMENT';
  payload: string | null;
}

export const HOVER_ELEMENT = 'HOVER_ELEMENT';

export const hoverElement = (id: string | null): HoverElement => ({
  type: HOVER_ELEMENT,
  payload: id,
});

export interface SelectView {
  type: 'SELECT_VIEW';
  payload: 'preview' | 'variable' | 'css';
}

export const SELECT_VIEW = 'SELECT_VIEW';

export const selectView = (view: 'preview' | 'variable' | 'css'): SelectView => ({
  type: SELECT_VIEW,
  payload: view,
});

export interface UpdatePreviewSize {
  type: 'UPDATE_PREVIEW_SIZE';
  payload: {
    previewSize: ScreenSize;
  };
}

export const UPDATE_PREVIEW_SIZE = 'UPDATE_PREVIEW_SIZE';

export const updatePreviewSize = (previewSize: ScreenSize): UpdatePreviewSize => ({
  type: UPDATE_PREVIEW_SIZE,
  payload: { previewSize },
});

export interface SelectVariable {
  type: 'SELECT_VARIABLE';
  payload: string;
}

export const SELECT_VARIABLE = 'SELECT_VARIABLE';

export const selectVariable = (id: string): SelectVariable => ({
  type: SELECT_VARIABLE,
  payload: id,
});

export type Action$View =
  | SelectRootElement
  | SelectElement
  | HoverElement
  | UpdatePreviewSize
  | SelectView
  | SelectVariable;
