import { Dispatch } from 'redux';
import { v4 as uuidv4 } from 'uuid';
import { TGetState, TThunkAction } from 'types/store';
import { selectPage, ISelectPage, selectElement, ISelectElement } from 'actions/element';
import { generateDefaultName, getPages, getSelectedPageId } from 'selectors/element';
import { Page } from '@ui-studio/types';

interface AddPage {
  type: 'ADD_PAGE';
  payload: Page;
}

export const ADD_PAGE = 'ADD_PAGE';

export const addPage = (): TThunkAction<AddPage> => (
  dispatch: Dispatch<AddPage | ISelectPage | ISelectElement>,
  getState: TGetState,
) => {
  const state = getState();
  const name = generateDefaultName(state, 'Page');
  const page: Page = {
    id: uuidv4(),
    type: 'page',
    name,
    props: {},
    style: {
      type: 'base',
      css: '',
      classNames: '',
    },
  };

  dispatch(selectPage(page.id));
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

export const removePage = (pageId: string): TThunkAction<RemovePage> => (
  dispatch: Dispatch<RemovePage | ISelectPage | ISelectElement>,
  getState: TGetState,
) => {
  const state = getState();
  const selectedPageId = getSelectedPageId(state);
  if (selectedPageId === pageId) {
    const firstPageId = Object.values(getPages(state)).filter((p) => p.id !== selectedPageId)[0].id;
    dispatch(selectPage(firstPageId));
    dispatch(selectElement(firstPageId));
  }

  return dispatch({
    type: REMOVE_PAGE,
    payload: pageId,
  });
};

export type Action$Page = AddPage | RemovePage;
