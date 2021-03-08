import { Dispatch } from 'redux';
import { v4 as uuidv4 } from 'uuid';
import { TStyle, Widget, WidgetProp, Event } from 'canvas-types';
import {
  makeGetElement,
  generateDefaultName,
  getNextPosition,
  makeGetComponents,
  getSelectedElementId,
} from 'selectors/element';
import { TGetState, TThunkAction } from 'types/store';
import { selectElement, ISelectElement } from 'actions/element';
import { StylesModel } from 'models/styles';
import { WidgetModel } from 'models/widget';

export const ADD_WIDGET = 'ADD_WIDGET';
export const REMOVE_WIDGET = 'REMOVE_WIDGET';
export const UPDATE_WIDGET_PROPS = 'UPDATE_WIDGET_PROPS';
export const UPDATE_WIDGET_STYLE = 'UPDATE_WIDGET_STYLE';

interface IAddWidget {
  type: 'ADD_WIDGET';
  payload: Widget;
}

export const addWidget = (
  componentName: string,
  library: string,
  parent: string,
): TThunkAction<IAddWidget> => (
  dispatch: Dispatch<IAddWidget | ISelectElement>,
  getState: TGetState,
) => {
  const state = getState();

  const parentElement = makeGetElement()(state, parent);
  if (!parentElement) throw Error();

  const component = makeGetComponents()(state).find((c) => c.name === componentName);
  if (!component) throw Error();

  const widget = WidgetModel.getDefaultWidget(state, component, library, parentElement);

  dispatch(selectElement(widget.id));

  return dispatch({
    type: ADD_WIDGET,
    payload: widget,
  });
};

export interface IRemoveWidget {
  type: 'REMOVE_WIDGET';
  payload: {
    id: string;
    parent: string;
    position: number;
    delete: boolean;
  };
}

export const removeWidget = (widget: Widget, del = false): TThunkAction<IRemoveWidget> => (
  dispatch: Dispatch<IRemoveWidget | ISelectElement>,
  getState: TGetState,
) => {
  const state = getState();

  const selectedElementId = getSelectedElementId(state);
  if (selectedElementId === widget.id) {
    dispatch(selectElement(null));
  }

  return dispatch({
    type: REMOVE_WIDGET,
    payload: {
      id: widget.id,
      parent: widget.parent,
      position: widget.position,
      delete: del,
    },
  });
};

interface IUpdateWidgetProps {
  type: 'UPDATE_WIDGET_PROPS';
  payload: {
    id: string;
    key: string;
    prop: WidgetProp | WidgetProp[] | { [subKey: string]: WidgetProp };
  };
}

export const updateWidgetProps = (
  id: string,
  key: string,
  prop: WidgetProp | WidgetProp[] | { [subKey: string]: WidgetProp },
): IUpdateWidgetProps => ({
  type: UPDATE_WIDGET_PROPS,
  payload: {
    id,
    key,
    prop,
  },
});

interface IUpdateWidgetStyle {
  type: 'UPDATE_WIDGET_STYLE';
  payload: {
    id: string;
    style: TStyle;
  };
}

export const updateWidgetStyle = (id: string, style: TStyle): IUpdateWidgetStyle => ({
  type: UPDATE_WIDGET_STYLE,
  payload: {
    id,
    style,
  },
});

interface AddWidgetEvent {
  type: 'ADD_WIDGET_EVENT';
  payload: {
    id: string;
    eventKey: string;
    event: Event;
  };
}

export const ADD_WIDGET_EVENT = 'ADD_WIDGET_EVENT';

export const addWidgetEvent = (id: string, eventKey: string, event: Event): AddWidgetEvent => ({
  type: ADD_WIDGET_EVENT,
  payload: {
    id,
    eventKey,
    event,
  },
});

interface UpdateWidgetEvent {
  type: 'UPDATE_WIDGET_EVENT';
  payload: {
    id: string;
    eventKey: string;
    index: number;
    event: Event;
  };
}

export const UPDATE_WIDGET_EVENT = 'UPDATE_WIDGET_EVENT';

export const updateWidgetEvent = (
  id: string,
  eventKey: string,
  index: number,
  event: Event,
): UpdateWidgetEvent => ({
  type: UPDATE_WIDGET_EVENT,
  payload: {
    id,
    eventKey,
    index,
    event,
  },
});

interface RemoveWidgetEvent {
  type: 'REMOVE_WIDGET_EVENT';
  payload: {
    id: string;
    eventKey: string;
    index: number;
  };
}

export const REMOVE_WIDGET_EVENT = 'REMOVE_WIDGET_EVENT';

export const removeWidgetEvent = (
  id: string,
  eventKey: string,
  index: number,
): RemoveWidgetEvent => ({
  type: REMOVE_WIDGET_EVENT,
  payload: {
    id,
    eventKey,
    index,
  },
});

interface UpdateWidgetParent {
  type: 'UPDATE_WIDGET_PARENT';
  payload: {
    widgetId: string;
    parentId: string;
    position: number;
  };
}

export const UPDATE_WIDGET_PARENT = 'UPDATE_WIDGET_PARENT';

export const updateWidgetParent = (
  widgetId: string,
  parentId: string,
): TThunkAction<UpdateWidgetParent> => (
  dispatch: Dispatch<UpdateWidgetParent>,
  getState: TGetState,
) => {
  const state = getState();
  const position = getNextPosition(state, parentId);
  return dispatch({
    type: UPDATE_WIDGET_PARENT,
    payload: {
      widgetId,
      parentId,
      position,
    },
  });
};

export type Action$Widget =
  | IAddWidget
  | IRemoveWidget
  | IUpdateWidgetProps
  | IUpdateWidgetStyle
  | AddWidgetEvent
  | UpdateWidgetEvent
  | RemoveWidgetEvent
  | UpdateWidgetParent;
