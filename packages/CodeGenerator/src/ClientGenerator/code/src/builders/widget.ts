import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import { Widget } from '@ui-builder/types';

import { getVariableValue, getWidgetPropertyValue } from '../selectors';
import { handleEvent } from '../actions/handleEvent';
import { updateWidget } from '../actions/updateWidget';
import { Store } from '../types/store';
import { Components } from '../Components';

export const WidgetBuilder = ({
  widget,
  children,
}: {
  children?: React.ReactNode;
  widget: Widget;
}): React.FunctionComponentElement<any> => {
  const mapStateToProps = (state: Store) => {
    const rawValues: { [key: string]: any } = Object.keys(widget.props).reduce((acc, cur) => {
      const prop = widget.props[cur];
      if (prop.mode === 'variable') {
        if (prop.type === 'object') {
          return {
            ...acc,
            [cur]: getVariableValue(state)(prop.variableId, prop.lookup),
          };
        }
        return {
          ...acc,
          [cur]: getVariableValue(state)(prop.variableId, null),
        };
      }

      if (prop.mode === 'widget') {
        return {
          ...acc,
          [cur]: getWidgetPropertyValue(state)(prop.widgetId, prop.lookup),
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
      ...values,
      error,
      loading,
    };
  };

  const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
      {
        updateWidget,
        handleEvent,
      },
      dispatch,
    );

  const W: React.FC<any> = (props: any) => {
    const eventHandlers = Object.keys(widget.events).reduce((acc, cur) => {
      return {
        ...acc,
        [cur]: () => props.handleEvent(widget.id, cur, props.history.push),
      };
    }, {});

    const WidgetWrapper = styled.div`
      height: 100%;
      width: 100%;

      ${widget.style.type === 'grid'
        ? `
        grid-row: ${widget.style.layout[0][0]} / ${widget.style.layout[1][0] + 1};
        grid-column: ${widget.style.layout[0][1]} / ${widget.style.layout[1][1] + 1};
      `
        : ''}

      ${widget.style.css}
    `;

    const handleExposedPropetyUpdate = (exposedProperties: { [key: string]: any }) => {
      props.updateWidget(widget.id, exposedProperties);
    };

    return React.createElement(
      WidgetWrapper,
      { className: widget.style.classNames },
      React.createElement(
        Components[widget.library][widget.component].component,
        Object.keys(widget.props).reduce(
          (acc, cur) => {
            return { ...acc, [cur]: props[cur] };
          },
          {
            ...eventHandlers,
            onExposedPropertiesChange: handleExposedPropetyUpdate,
          },
        ),
        props.children,
      ),
    );
  };

  return React.createElement(
    connect(mapStateToProps, mapDispatchToProps)(withRouter(W)),
    null,
    children,
  );
};
