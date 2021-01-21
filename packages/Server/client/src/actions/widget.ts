import { Dispatch } from 'redux';
import { v4 as uuidv4 } from 'uuid';
import { TStyle, Element, Widget, WidgetProp } from '@ui-builder/types';
import {
  makeGetElement,
  makeGenerateDefaultName,
  makeGetNextPosition,
  makeGetComponents,
  getParentElement,
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
        };
      }
      if (parent.layoutType === 'flex') {
        return {
          type: 'flex',
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
  const name = makeGenerateDefaultName()(
    state,
    component.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()),
  );
  const defaultStyle = getDefaultStyle(parentElement);
  const position = makeGetNextPosition()(state, parentElement.id);
  const hasChildren = Boolean(
    makeGetComponents()(state).find((c) => c.name === component)?.hasChildren,
  );
  const widget: Widget = {
    id: uuidv4(),
    type: 'widget',
    name,
    component,
    library,
    parent,
    position,
    hasChildren,
    props: {},
    events: {},
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

export const removeWidget = (widget: Widget, del = false): IRemoveWidget => ({
  type: REMOVE_WIDGET,
  payload: {
    id: widget.id,
    parent: widget.parent,
    position: widget.position,
    delete: del,
  },
});

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

export type Action$Widget = IAddWidget | IRemoveWidget | IUpdateWidgetProps | IUpdateWidgetStyle;
