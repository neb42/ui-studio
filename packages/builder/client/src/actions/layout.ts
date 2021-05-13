import { Dispatch } from 'redux';
import { Layout } from '@ui-studio/types';
import { TGetState, TThunkAction } from 'types/store';
import { getSelectedRootId, getSelectedElementId } from 'selectors/view';
import { getSelectedElement } from 'selectors/tree';

export interface UpdateWidgetLayoutConfig {
  type: 'UPDATE_WIDGET_LAYOUT_CONFIG';
  payload: {
    rootId: string;
    widgetId: string;
    layout: Layout;
  };
}

export const UPDATE_WIDGET_LAYOUT_CONFIG = 'UPDATE_WIDGET_LAYOUT_CONFIG';

export const updateWidgetLayoutConfig = (
  key: string,
  value: any,
): TThunkAction<UpdateWidgetLayoutConfig> => (
  dispatch: Dispatch<UpdateWidgetLayoutConfig>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  const widget = getSelectedElement(state);
  if (!rootId || !widget || widget.rootElement) throw Error();
  return dispatch({
    type: UPDATE_WIDGET_LAYOUT_CONFIG,
    payload: {
      rootId,
      widgetId: widget.id,
      layout: {
        ...widget.layout,
        [key]: value,
      } as Layout,
    },
  });
};

export interface UpdateWidgetLayoutType {
  type: 'UPDATE_WIDGET_LAYOUT_TYPE';
  payload: {
    rootId: string;
    widgetId: string;
    layoutType: 'basic' | 'flex' | 'grid';
  };
}

export const UPDATE_WIDGET_LAYOUT_TYPE = 'UPDATE_WIDGET_LAYOUT_TYPE';

export const updateWidgetLayoutType = (
  id: string,
  layoutType: 'basic' | 'flex' | 'grid',
): TThunkAction<UpdateWidgetLayoutType> => (
  dispatch: Dispatch<UpdateWidgetLayoutType>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  const widgetId = getSelectedElementId(state);
  if (!rootId || !widgetId) throw Error();
  return dispatch({
    type: UPDATE_WIDGET_LAYOUT_TYPE,
    payload: {
      rootId,
      widgetId,
      layoutType,
    },
  });
};

export type Action$Layout = UpdateWidgetLayoutConfig | UpdateWidgetLayoutType;
