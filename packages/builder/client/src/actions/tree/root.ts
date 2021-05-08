import { Dispatch } from 'redux';
import { Page, CustomComponent } from '@ui-studio/types';
import { TGetState, TThunkAction } from 'types/store';
import { selectRootElement, SelectRootElement, selectElement, SelectElement } from 'actions/view';
import { getRoots } from 'selectors/tree';
import { getSelectedRootId } from 'selectors/view';
import { CustomComponentModel } from 'models/customComponent';
import { PageModel } from 'models/page';

export interface AddRoot {
  type: 'ADD_ROOT';
  payload: Page | CustomComponent;
}

export const ADD_ROOT = 'ADD_ROOT';

export const addPage = (): TThunkAction<AddRoot> => (
  dispatch: Dispatch<AddRoot | SelectRootElement | SelectElement>,
  getState: TGetState,
) => {
  const state = getState();
  const page = PageModel.getDefaultPage(state);

  dispatch(selectRootElement(page.id));
  dispatch(selectElement(page.id));

  return dispatch({
    type: ADD_ROOT,
    payload: page,
  });
};

export const addCustomComponent = (): TThunkAction<AddRoot> => (
  dispatch: Dispatch<AddRoot | SelectRootElement | SelectElement>,
  getState: TGetState,
) => {
  const state = getState();
  const customComponent = CustomComponentModel.getDefaultCustomComponent(state);

  dispatch(selectRootElement(customComponent.id));
  dispatch(selectElement(customComponent.id));

  return dispatch({
    type: ADD_ROOT,
    payload: customComponent,
  });
};

export interface RemoveRoot {
  type: 'REMOVE_ROOT';
  payload: string;
}

export const REMOVE_ROOT = 'REMOVE_ROOT';

export const removeRoot = (rootId: string): TThunkAction<RemoveRoot> => (
  dispatch: Dispatch<RemoveRoot | SelectRootElement | SelectElement>,
  getState: TGetState,
) => {
  const state = getState();
  const selectedRootElementId = getSelectedRootId(state);
  if (selectedRootElementId === rootId) {
    const firstRootId = getRoots(state).filter((p) => p.id !== selectedRootElementId)[0].id;
    dispatch(selectRootElement(firstRootId));
    dispatch(selectElement(firstRootId));
  }

  return dispatch({
    type: REMOVE_ROOT,
    payload: rootId,
  });
};
