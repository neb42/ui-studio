import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Widget, CustomComponentInstance } from '@ui-studio/types';

import { getProp } from '../selectors';
import { handleEvent } from '../actions/handleEvent';
import { updateWidget } from '../actions/updateWidget';
import { updateHoverElement, updateSelectedElement } from '../actions/development';
import { Components } from '../Components';
import { Store } from '../types/store';

import { useChildrenMap } from './tree';

const WidgetWrapper = styled.div<{ widget: Widget | CustomComponentInstance; isSelected: boolean }>`
  ${({ widget }) =>
    widget.layout?.type === 'grid'
      ? `
        display: grid;
        grid-template-columns: ${widget.layout.columns
          .map((l) => `${l.value || ''}${l.unit}`)
          .join(' ')};
        grid-template-rows: ${widget.layout.rows.map((l) => `${l.value || ''}${l.unit}`).join(' ')};
        grid-column-gap: ${widget.layout.columnGap}px;
        grid-row-gap: ${widget.layout.rowGap}px;
        align-items: ${widget.layout.rowAlignment};
        justify-content: ${widget.layout.columnAlignment};
      `
      : ''}

  ${({ widget }) =>
    widget.layout?.type === 'flex'
      ? `
        display: flex;
        flex-direction: ${widget.layout.direction};
        align-items: ${widget.layout.align};
        justify-content: ${widget.layout.justify};
        flex-wrap: ${widget.layout.wrap ? 'wrap' : 'nowrap'};
      `
      : ''}

  ${({ widget }) =>
    widget.style.type === 'grid'
      ? `
        grid-row: ${widget.style.layout[0][0]} / ${widget.style.layout[1][0] + 1};
        grid-column: ${widget.style.layout[0][1]} / ${widget.style.layout[1][1] + 1};
        align-self: ${widget.style.rowAlignment};
        justify-self: ${widget.style.columnAlignment};
      `
      : ''}

  ${({ widget }) =>
    widget.style.type === 'flex'
      ? `
        align-self: ${widget.style.align};
        flex-grow: ${widget.style.grow};
      `
      : ''}

  ${({ widget }) =>
    widget.style.backgroundColor ? `background-color: ${widget.style.backgroundColor};` : ''}

  ${({ widget }) => widget.style.css}

  ${({ theme, isSelected }) => (isSelected ? `border: 1px solid ${theme.colors.brand500};` : '')}
`;

const useGetProps = (
  widget: Widget | CustomComponentInstance,
  rootId: string | null,
  iteratorIndex: { [widgetId: string]: { [prop: string]: number } },
): {
  error: boolean;
  loading: boolean;
  values: {
    [key: string]: any;
  };
  exposedProperties: {
    [key: string]: any;
  };
} => {
  const getPropInstance = useSelector(getProp);
  const rawValues: { [key: string]: any } = Object.keys(widget.props).reduce((acc, cur) => {
    const prop = getPropInstance(widget.id, rootId, widget.props[cur], iteratorIndex);

    return { ...acc, [cur]: prop };
  }, {});

  const loading = Object.keys(rawValues).some((k) => {
    const v = rawValues[k];
    if (v && typeof v === 'object' && Object.keys(v).includes('loading')) {
      if (v.loading) {
        return true;
      }
    }
    return false;
  });

  const error = Object.keys(rawValues).some((k) => {
    const v = rawValues[k];
    if (v && typeof v === 'object' && Object.keys(v).includes('error')) {
      if (v.error) {
        return true;
      }
    }
    return false;
  });

  const values = Object.keys(rawValues).reduce((acc, cur) => {
    const v = rawValues[cur];
    if (v && typeof v === 'object' && Object.keys(v).includes('value')) {
      return {
        ...acc,
        [cur]: v.value,
      };
    }
    return { ...acc, [cur]: v };
  }, {});

  return {
    values,
    exposedProperties: {},
    error,
    loading,
  };
};

const useEventHandlers = (widget: Widget | CustomComponentInstance) => {
  const dispatch = useDispatch();
  const history = useHistory();
  return Object.keys(widget.events).reduce((acc, cur) => {
    return {
      ...acc,
      [cur]: () => dispatch(handleEvent(widget.id, cur, history.push)),
    };
  }, {});
};

export const WidgetBuilder: React.FC<any> = ({
  widgetId,
  rootId,
  iteratorIndex = {},
}: {
  widgetId: string;
  rootId: string;
  iteratorIndex: { [widgetId: string]: { [prop: string]: number } };
}) => {
  const widget = useSelector((state: Store) => state.widget.config[widgetId]);
  const dispatch = useDispatch();
  const { loading, error, values, exposedProperties } = useGetProps(widget, rootId, iteratorIndex);
  const eventHandlers = useEventHandlers(widget);
  const isSelected = useSelector(
    (state: Store) =>
      state.development.selectedElement === widget.id ||
      state.development.hoverElement === widget.id,
  );

  /* Used for selecting element with mouse. Causes issues with onClick events.
  const selectedElementId = useSelector((state: Store) => state.development.selectedElement);
  const hoverElementId = useSelector((state: Store) => state.development.hoverElement);

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (selectedElementId !== widgetId) {
      event.stopPropagation();
      dispatch(updateSelectedElement(widgetId));
    }
  };

  const handleOnMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (hoverElementId !== widgetId) {
      event.stopPropagation();
      dispatch(updateHoverElement(widgetId));
    }
  };
  */

  const handleExposedPropetyUpdate = (ep: { [key: string]: any }) => {
    dispatch(updateWidget(widget.id, rootId, ep));
  };

  const props = Object.keys(widget.props).reduce(
    (acc, cur) => {
      return { ...acc, [cur]: values[cur] };
    },
    {
      ...eventHandlers,
      key: `widget-${widget.id}`,
      widgetId: widget.id,
      loading,
      error,
      exposedProperties,
      onExposedPropertiesChange: handleExposedPropetyUpdate,
    },
  );

  const children = useChildrenMap(
    widget.type === 'customComponentInstance' ? widget.customComponentId : widgetId,
    widget.type === 'customComponentInstance' ? widget.id : rootId,
    iteratorIndex,
  );

  const C =
    widget.type === 'widget' ? Components[widget.library][widget.component].component : 'div';

  return React.createElement(
    WidgetWrapper,
    {
      key: `widget-wrapper-${widget.id}`,
      className: widget.style.classNames,
      // onClick: handleOnClick,
      // onMouseOver: handleOnMouseMove,
      widget,
      isSelected,
    },
    React.createElement(C, props, children),
  );
};
