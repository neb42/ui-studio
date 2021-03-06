import { Dispatch } from 'redux';
import { TStyle, Layout } from 'canvas-types';
import { makeGetElement, getNextPosition, getSelectedElementId } from 'selectors/element';
import { TGetState, TThunkAction } from 'types/store';
import { selectElement, ISelectElement } from 'actions/element';
import { LayoutModel } from 'models/layout';

export const ADD_LAYOUT = 'ADD_LAYOUT';
export const REMOVE_LAYOUT = 'REMOVE_LAYOUT';
export const UPDATE_LAYOUT_CONFIG = 'UPDATE_LAYOUT_CONFIG';
export const UPDATE_LAYOUT_STYLE = 'UPDATE_LAYOUT_STYLE';

interface IAddLayout {
  type: 'ADD_LAYOUT';
  payload: Layout;
}

export const addLayout = (
  layoutType: 'grid' | 'flex',
  parent: string,
): TThunkAction<IAddLayout> => (
  dispatch: Dispatch<IAddLayout | ISelectElement>,
  getState: TGetState,
) => {
  const state = getState();

  const parentElement = makeGetElement()(state, parent);
  if (!parentElement) throw Error();

  const layout = LayoutModel.getDefaultLayout(state, parentElement, layoutType);

  dispatch(selectElement(layout.id));

  return dispatch({
    type: ADD_LAYOUT,
    payload: layout,
  });
};

export interface IRemoveLayout {
  type: 'REMOVE_LAYOUT';
  payload: {
    id: string;
    parent: string;
    position: number;
    delete: boolean;
  };
}

export const removeLayout = (layout: Layout, del = false): TThunkAction<IRemoveLayout> => (
  dispatch: Dispatch<IRemoveLayout | ISelectElement>,
  getState: TGetState,
) => {
  const state = getState();

  const selectedElementId = getSelectedElementId(state);
  if (selectedElementId === layout.id) {
    dispatch(selectElement(null));
  }

  return dispatch({
    type: REMOVE_LAYOUT,
    payload: {
      id: layout.id,
      parent: layout.parent,
      position: layout.position,
      delete: del,
    },
  });
};

interface IUpdateLayoutConfig {
  type: 'UPDATE_LAYOUT_CONFIG';
  payload: {
    id: string;
    key: string;
    value: any;
  };
}

export const updateLayoutConfig = (id: string, key: string, value: any): IUpdateLayoutConfig => ({
  type: UPDATE_LAYOUT_CONFIG,
  payload: {
    id,
    key,
    value,
  },
});

interface IUpdateLayoutStyle {
  type: 'UPDATE_LAYOUT_STYLE';
  payload: {
    id: string;
    style: TStyle;
  };
}

export const updateLayoutStyle = (id: string, style: TStyle): IUpdateLayoutStyle => ({
  type: UPDATE_LAYOUT_STYLE,
  payload: {
    id,
    style,
  },
});

interface UpdateLayoutParent {
  type: 'UPDATE_LAYOUT_PARENT';
  payload: {
    layoutId: string;
    parentId: string;
    position: number;
  };
}

export const UPDATE_LAYOUT_PARENT = 'UPDATE_LAYOUT_PARENT';

export const updateLayoutParent = (
  layoutId: string,
  parentId: string,
): TThunkAction<UpdateLayoutParent> => (
  dispatch: Dispatch<UpdateLayoutParent>,
  getState: TGetState,
) => {
  const state = getState();
  const position = getNextPosition(state, parentId);
  return dispatch({
    type: UPDATE_LAYOUT_PARENT,
    payload: {
      layoutId,
      parentId,
      position,
    },
  });
};

export type Action$Layout =
  | IAddLayout
  | IRemoveLayout
  | IUpdateLayoutConfig
  | IUpdateLayoutStyle
  | UpdateLayoutParent;
