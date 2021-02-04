import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Widget } from '@ui-builder/types';

import { getVariableValue, getWidgetPropertyValue } from '../selectors';
import { handleEvent } from '../actions/handleEvent';
import { updateWidget } from '../actions/updateWidget';
import { Components } from '../Components';
import { Store } from '../types/store';

const WidgetWrapper = styled.div<{ widget: Widget; isSelected: boolean }>`
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
        justify-self: ${widget.style.justify};
        flex-grow: ${widget.style.grow};
      `
      : ''}

  ${({ widget }) => widget.style.css}

  ${({ theme, isSelected }) => (isSelected ? `border: 1px solid ${theme.colors.brand500};` : '')}
`;

const useGetProps = (
  widget: Widget,
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
  const getVariableValueInstance = useSelector(getVariableValue);
  const getWidgetPropertyValueInstance = useSelector(getWidgetPropertyValue);

  const rawValues: { [key: string]: any } = Object.keys(widget.props).reduce((acc, cur) => {
    const prop = widget.props[cur];
    if (prop.mode === 'variable') {
      if (prop.type === 'object') {
        return {
          ...acc,
          [cur]: getVariableValueInstance(prop.variableId, prop.lookup),
        };
      }
      return {
        ...acc,
        [cur]: getVariableValueInstance(prop.variableId, null),
      };
    }

    if (prop.mode === 'widget') {
      return {
        ...acc,
        [cur]: getWidgetPropertyValueInstance(prop.widgetId, prop.lookup),
      };
    }

    if (prop.mode === 'static') {
      return {
        ...acc,
        [cur]: prop.value,
      };
    }

    return acc;
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

const useEventHandlers = (widget: Widget) => {
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
  widget,
  children,
}: {
  children?: React.ReactNode;
  widget: Widget;
}) => {
  const dispatch = useDispatch();
  const { loading, error, values, exposedProperties } = useGetProps(widget);
  const eventHandlers = useEventHandlers(widget);
  const isSelected = useSelector(
    (state: Store) =>
      state.development.selectedElement === widget.id ||
      state.development.hoverElement === widget.id,
  );

  const handleExposedPropetyUpdate = (ep: { [key: string]: any }) => {
    dispatch(updateWidget(widget.id, ep));
  };

  const props = Object.keys(widget.props).reduce(
    (acc, cur) => {
      return { ...acc, [cur]: values[cur] };
    },
    {
      ...eventHandlers,
      loading,
      error,
      exposedProperties,
      onExposedPropertiesChange: handleExposedPropetyUpdate,
    },
  );

  const C = Components[widget.library][widget.component].component;

  return React.createElement(
    WidgetWrapper,
    { className: widget.style.classNames, widget, isSelected },
    React.createElement(C, props, children),
  );
};
