import { Dispatch } from 'redux';
import { v4 as uuidv4 } from 'uuid';
import { TStyle, Element, Widget, WidgetProp, Event } from 'canvas-types';
import {
  makeGetElement,
  makeGenerateDefaultName,
  makeGetNextPosition,
  makeGetComponents,
  getSelectedElementId,
} from 'selectors/element';
import { TGetState, TThunkAction } from 'types/store';
import { selectElement, ISelectElement } from 'actions/element';

export const ADD_WIDGET = 'ADD_WIDGET';
export const REMOVE_WIDGET = 'REMOVE_WIDGET';
export const UPDATE_WIDGET_PROPS = 'UPDATE_WIDGET_PROPS';
export const UPDATE_WIDGET_STYLE = 'UPDATE_WIDGET_STYLE';

const getDefaultStyle = (parent: Element | null): TStyle => {
  if (parent) {
    if (parent.type === 'layout') {
      if (parent.layoutType === 'grid') {
        return {
          type: 'grid',
          css: '',
          classNames: '',
          layout: [
            [0, 0],
            [0, 0],
          ],
          rowAlignment: 'stretch',
          columnAlignment: 'stretch',
        };
      }
      if (parent.layoutType === 'flex') {
        return {
          type: 'flex',
          align: 'auto',
          justify: 'auto',
          grow: 0,
          css: '',
          classNames: '',
        };
      }
    }
    if (parent.type === 'page') {
      return {
        type: 'page',
        css: '',
        classNames: '',
      };
    }
    return { type: 'base', css: '', classNames: '' };
  }
  throw Error();
};

interface IAddWidget {
  type: 'ADD_WIDGET';
  payload: Widget;
}

export const addWidget = (
  component: string,
  library: string,
  parent: string,
): TThunkAction<IAddWidget> => (
  dispatch: Dispatch<IAddWidget | ISelectElement>,
  getState: TGetState,
) => {
  const state = getState();

  const parentElement = makeGetElement()(state, parent);
  if (!parentElement) throw Error();

  const componentConfig = makeGetComponents()(state).find((c) => c.name === component);
  if (!componentConfig) throw Error();

  const name = makeGenerateDefaultName()(
    state,
    component.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()),
  );
  const defaultStyle = getDefaultStyle(parentElement);
  const position = makeGetNextPosition()(state, parentElement.id);
  const hasChildren = Boolean(componentConfig.hasChildren);
  const events = componentConfig.events.reduce((acc, cur) => ({ ...acc, [cur.key]: [] }), {});
  const props = componentConfig.config.reduce((acc, cur) => {
    const defaultProp = (() => {
      switch (cur.type) {
        case 'string': {
          const value = cur.component === 'input' ? '' : cur.options[0]?.key ?? '';
          return { mode: 'static', type: 'string', value };
        }
        case 'number': {
          const value = cur.component === 'input' ? 0 : cur.options[0]?.key ?? 0;
          return { mode: 'static', type: 'number', value };
        }
        case 'boolean': {
          const value = cur.component === 'input' ? true : cur.options[0]?.key ?? true;
          return { mode: 'static', type: 'boolean', value };
        }
        case 'object': {
          const value = cur.component === 'input' ? '' : cur.options[0]?.key ?? '';
          return { mode: 'static', type: 'object', value };
        }
        default:
          throw Error();
      }
    })();
    return { ...acc, [cur.key]: defaultProp };
  }, {});

  const widget: Widget = {
    id: uuidv4(),
    type: 'widget',
    name,
    component,
    library,
    parent,
    position,
    hasChildren,
    props,
    events,
    style: defaultStyle,
  };

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
    prop: WidgetProp;
  };
}

export const updateWidgetProps = (
  id: string,
  key: string,
  prop: WidgetProp,
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

export type Action$Widget =
  | IAddWidget
  | IRemoveWidget
  | IUpdateWidgetProps
  | IUpdateWidgetStyle
  | AddWidgetEvent
  | UpdateWidgetEvent
  | RemoveWidgetEvent;
