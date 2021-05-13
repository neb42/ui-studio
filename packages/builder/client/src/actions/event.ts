import { Dispatch } from 'redux';
import { Event } from '@ui-studio/types';

import { getSelectedRootId, getSelectedElementId } from 'selectors/view';
import { TGetState, TThunkAction } from 'types/store';

export interface AddWidgetEvent {
  type: 'ADD_WIDGET_EVENT';
  payload: {
    rootId: string;
    widgetId: string;
    eventKey: string;
    event: Event;
  };
}

export const ADD_WIDGET_EVENT = 'ADD_WIDGET_EVENT';

export const addWidgetEvent = (eventKey: string, event: Event): TThunkAction<AddWidgetEvent> => (
  dispatch: Dispatch<AddWidgetEvent>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  const widgetId = getSelectedElementId(state);
  if (!rootId || !widgetId) throw Error();
  return dispatch({
    type: ADD_WIDGET_EVENT,
    payload: {
      rootId,
      widgetId,
      eventKey,
      event,
    },
  });
};

export interface UpdateWidgetEvent {
  type: 'UPDATE_WIDGET_EVENT';
  payload: {
    rootId: string;
    widgetId: string;
    eventKey: string;
    index: number;
    event: Event;
  };
}

export const UPDATE_WIDGET_EVENT = 'UPDATE_WIDGET_EVENT';

export const updateWidgetEvent = (
  eventKey: string,
  index: number,
  event: Event,
): TThunkAction<UpdateWidgetEvent> => (
  dispatch: Dispatch<UpdateWidgetEvent>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  const widgetId = getSelectedElementId(state);
  if (!rootId || !widgetId) throw Error();
  return dispatch({
    type: UPDATE_WIDGET_EVENT,
    payload: {
      rootId,
      widgetId,
      eventKey,
      index,
      event,
    },
  });
};

export interface RemoveWidgetEvent {
  type: 'REMOVE_WIDGET_EVENT';
  payload: {
    rootId: string;
    widgetId: string;
    eventKey: string;
    index: number;
  };
}

export const REMOVE_WIDGET_EVENT = 'REMOVE_WIDGET_EVENT';

export const removeWidgetEvent = (
  eventKey: string,
  index: number,
): TThunkAction<RemoveWidgetEvent> => (
  dispatch: Dispatch<RemoveWidgetEvent>,
  getState: TGetState,
) => {
  const state = getState();
  const rootId = getSelectedRootId(state);
  const widgetId = getSelectedElementId(state);
  if (!rootId || !widgetId) throw Error();
  return dispatch({
    type: REMOVE_WIDGET_EVENT,
    payload: {
      rootId,
      widgetId,
      eventKey,
      index,
    },
  });
};
