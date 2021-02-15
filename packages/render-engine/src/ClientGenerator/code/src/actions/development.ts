export interface UpdateHoverElement {
  type: 'UPDATE_HOVER_ELEMENT';
  payload: {
    id: string | null;
  };
}

export const UPDATE_HOVER_ELEMENT = 'UPDATE_HOVER_ELEMENT';

export const updateHoverElement = (id: string | null): UpdateHoverElement => ({
  type: UPDATE_HOVER_ELEMENT,
  payload: {
    id,
  },
});

export interface UpdateSelectedElement {
  type: 'UPDATE_SELECTED_ELEMENT';
  payload: {
    id: string | null;
  };
}

export const UPDATE_SELECTED_ELEMENT = 'UPDATE_SELECTED_ELEMENT';

export const updateSelectedElement = (id: string | null): UpdateSelectedElement => ({
  type: UPDATE_SELECTED_ELEMENT,
  payload: {
    id,
  },
});
