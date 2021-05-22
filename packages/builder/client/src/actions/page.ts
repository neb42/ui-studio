import { Dispatch } from 'redux';
import { Page } from '@ui-studio/types';
import { TGetState, TThunkAction } from 'types/store';
import { selectRootElement, SelectRootElement, selectElement, SelectElement } from 'actions/view';
import { getRoots } from 'selectors/tree';
import { getSelectedRootId } from 'selectors/view';
import { PageModel } from 'models/page';
import { UpdatePageStyle } from 'actions/styles';
import { UpdatePageName } from 'actions/name';
import { InitClient } from 'actions/init';

export interface AddPage {
  type: 'ADD_PAGE';
  payload: Page;
}

export const ADD_PAGE = 'ADD_PAGE';

export const addPage = (): TThunkAction<AddPage> => (
  dispatch: Dispatch<AddPage | SelectRootElement | SelectElement>,
  getState: TGetState,
) => {
  const state = getState();
  const page = PageModel.getDefaultPage(state);

  dispatch(selectRootElement(page.id));
  dispatch(selectElement(page.id));

  return dispatch({
    type: ADD_PAGE,
    payload: page,
  });
};

export interface RemovePage {
  type: 'REMOVE_PAGE';
  payload: string;
}

export const REMOVE_PAGE = 'REMOVE_PAGE';

export const removePage = (rootId: string): TThunkAction<RemovePage> => (
  dispatch: Dispatch<RemovePage | SelectRootElement | SelectElement>,
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
    type: REMOVE_PAGE,
    payload: rootId,
  });
};

export type Action$Page = AddPage | RemovePage | UpdatePageStyle | UpdatePageName | InitClient;
