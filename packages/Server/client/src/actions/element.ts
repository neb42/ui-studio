export const UPDATE_ELEMENT_NAME = 'UPDATE_ELEMENT_NAME';
export const SELECT_ELEMENT = 'SELECT_ELEMENT';
export const TOGGLE_ADD_ELEMENT_MODAL = 'TOGGLE_ADD_ELEMENT_MODAL';

export interface IUpdateElementName {
  type: 'UPDATE_ELEMENT_NAME';
  payload: {
    id: string;
    type: 'widget' | 'layout' | 'page';
    name: string;
  };
}

export const updateElementName = (
  id: string,
  type: 'widget' | 'layout' | 'page',
  name: string,
): IUpdateElementName => {
  return {
    type: UPDATE_ELEMENT_NAME,
    payload: {
      id,
      name,
      type,
    },
  };
};

interface ISelectElement {
  type: 'SELECT_ELEMENT';
  payload: string;
}

export const selectElement = (name: string): ISelectElement => ({
  type: SELECT_ELEMENT,
  payload: name,
});

interface IToggleAddElementModal {
  type: 'TOGGLE_ADD_ELEMENT_MODAL';
}

export const toggleAddElementModal = (): IToggleAddElementModal => ({
  type: TOGGLE_ADD_ELEMENT_MODAL,
});

export type Action$Element = ISelectElement | IUpdateElementName | IToggleAddElementModal;
