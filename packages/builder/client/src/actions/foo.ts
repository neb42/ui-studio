import { Dispatch } from 'redux';
import {
  ComponentConfig,
  CustomComponentInstance,
  FunctionVariable$StaticArg,
  Widget,
} from '@ui-studio/types';
import { TGetState, TThunkAction } from 'types/store';
import { UPDATE_VARIABLE_FUNCTION_ARG, UpdateVariableFunctionArg } from 'actions/variable';
import { WidgetModel } from 'models/widget';

import { RemoveWidget, REMOVE_WIDGET, UpdateWidgetProps, UPDATE_WIDGET_PROPS } from './widget';

// Triggered from change in widgets

export const resetVariableFunctionArgsUsingWidget = (widgetId: string): any => (
  dispatch: Dispatch<UpdateVariableFunctionArg>,
  getState: TGetState,
) => {
  const state = getState();

  Object.keys(state.variable).forEach((variableId) => {
    const variable = state.variable[variableId];
    if (variable.type === 'function') {
      variable.args.forEach((a, i) => {
        if (a.type === 'widget' && a.widgetId === widgetId) {
          const arg: FunctionVariable$StaticArg = (() => {
            const argConfig = state.configuration.functions.find(
              (f) => f.name === variable.functionId,
            )?.args[i];
            if (!argConfig) throw new Error();
            switch (argConfig.type) {
              case 'string': {
                return { type: 'static', valueType: 'string', value: '' } as const;
              }
              case 'number': {
                return { type: 'static', valueType: 'number', value: 0 } as const;
              }
              case 'boolean': {
                return { type: 'static', valueType: 'boolean', value: true } as const;
              }
              default:
                throw new Error();
            }
          })();
          dispatch({
            type: UPDATE_VARIABLE_FUNCTION_ARG,
            payload: {
              variableId,
              index: i,
              arg,
            },
          });
        }
      });
    }
  });
};

export const resetWidgetPropsUsingWidget = (widgetId: string): any => (
  dispatch: Dispatch<UpdateWidgetProps>,
  getState: TGetState,
) => {
  const state = getState();

  const widgets = Object.keys(state.widget).reduce<
    { widget: Widget | CustomComponentInstance; rootId: string; keys: string[] }[]
  >((acc, cur) => {
    return [
      ...acc,
      ...Object.keys(state.widget[cur]).reduce<
        { widget: Widget | CustomComponentInstance; rootId: string; keys: string[] }[]
      >((a, c) => {
        const widget = state.widget[cur][c];
        const keys = Object.keys(widget.props).filter((k) => {
          const prop = widget.props[k];
          return prop.mode === 'widget' && prop.widgetId === widgetId;
        });
        if (keys.length > 0) {
          return [...a, { widget, rootId: cur, keys }];
        }
        return a;
      }, []),
    ];
  }, []);

  widgets.forEach((w) => {
    w.keys.forEach((k) => {
      const widgetConfig: ComponentConfig = (() => {
        const ww = w.widget;
        if (ww.type === 'widget') {
          const conf = state.configuration.components
            .find((c) => c.library === ww.library)
            ?.config?.find((c) => c.key === k);
          if (!conf) throw new Error();
          return conf;
        }
        const conf = state.customComponent[ww.customComponentId].config?.find((c) => c.key === k);
        if (!conf) throw new Error();
        return conf;
      })();
      dispatch({
        type: UPDATE_WIDGET_PROPS,
        payload: {
          rootId: w.rootId,
          widgetId: w.widget.id,
          key: k,
          prop: WidgetModel.getDefaultProp('static', widgetConfig),
        },
      });
    });
  });
};

// Triggered from change in custom components

export const removeWidgetsUsingCustomComponent = (customComponentId: string): any => (
  dispatch: Dispatch<RemoveWidget>,
  getState: TGetState,
) => {
  const state = getState();

  Object.keys(state.widget)
    .reduce<
      {
        widget: CustomComponentInstance;
        rootId: string;
      }[]
    >((acc, cur) => {
      return [
        ...acc,
        ...Object.values(state.widget[cur])
          .filter(
            (w): w is CustomComponentInstance =>
              w.type === 'customComponentInstance' && w.customComponentId === customComponentId,
          )
          .map((c) => ({ widget: c, rootId: cur })),
      ];
    }, [])
    .forEach((c) => {
      dispatch(resetWidgetPropsUsingWidget(c.widget.id));
      dispatch({
        type: REMOVE_WIDGET,
        payload: {
          rootId: c.rootId,
          widgetId: c.widget.id,
          parent: c.widget.parent,
          position: c.widget.position,
          delete: false,
        },
      });
    });
};

export const resetCustomComponentInstancesPropsFromCustomComponent = (
  customComponentId: string,
  config: ComponentConfig,
): any => (dispatch: Dispatch<UpdateWidgetProps>, getState: TGetState) => {
  const state = getState();

  const customComponentInstances = Object.keys(state.widget).reduce<
    { rootId: string; customComponentInstance: CustomComponentInstance }[]
  >((acc, cur) => {
    return [
      ...acc,
      ...Object.values(state.widget[cur])
        .filter(
          (w): w is CustomComponentInstance =>
            w.type === 'customComponentInstance' && w.customComponentId === customComponentId,
        )
        .map((c) => ({ rootId: cur, customComponentInstance: c })),
    ];
  }, []);

  customComponentInstances.forEach((c) => {
    dispatch({
      type: UPDATE_WIDGET_PROPS,
      payload: {
        rootId: c.rootId,
        widgetId: c.customComponentInstance.id,
        key: config.key,
        prop: WidgetModel.getDefaultProp('static', config),
      },
    });
  });
};

export const updateVariableFunctionArgUsingCustomComponentExposedPropertyKey = (
  customComponentId: string,
  oldKey: string,
  newKey: string,
): any => (dispatch: Dispatch<UpdateVariableFunctionArg>, getState: TGetState) => {
  const state = getState();

  const widgetMap = Object.values(state.widget).reduce((acc, cur) => {
    return {
      ...acc,
      ...cur,
    };
  }, {});

  Object.keys(state.variable).forEach((variableId) => {
    const variable = state.variable[variableId];
    if (variable.type === 'function') {
      variable.args.forEach((a, i) => {
        if (a.type === 'widget' && a.property === oldKey) {
          const propWidget = widgetMap[a.widgetId];
          if (
            propWidget.type === 'customComponentInstance' &&
            propWidget.customComponentId === customComponentId
          ) {
            const arg = {
              ...a,
              property: newKey,
            };
            dispatch({
              type: UPDATE_VARIABLE_FUNCTION_ARG,
              payload: {
                variableId,
                index: i,
                arg,
              },
            });
          }
        }
      });
    }
  });
};

export const resetWidgetPropsAndVariableFunctionArgsUsingCustomComponentExposedPropertyKey = (
  customComponentId: string,
  key: string,
): any => (dispatch: Dispatch<UpdateWidgetProps>, getState: TGetState) => {
  const state = getState();

  Object.keys(state.widget).forEach((rId) => {
    Object.values(state.widget[rId]).forEach((widget) => {
      Object.keys(widget.props).forEach((propKey) => {
        const prop = widget.props[propKey];
        if (prop.mode === 'widget' && prop.lookup === key) {
          const propWidget = state.widget[rId][prop.widgetId];
          if (
            propWidget.type === 'customComponentInstance' &&
            propWidget.customComponentId === customComponentId
          ) {
            const widgetConfig: ComponentConfig = (() => {
              if (widget.type === 'widget') {
                const conf = state.configuration.components
                  .find((c) => c.key === widget.library)
                  ?.config?.find((c) => c.key === key);
                if (!conf) throw new Error();
                return conf;
              }
              const conf = state.customComponent[widget.customComponentId].config?.find(
                (c) => c.key === key,
              );
              if (!conf) throw new Error();
              return conf;
            })();
            dispatch({
              type: UPDATE_WIDGET_PROPS,
              payload: {
                rootId: rId,
                widgetId: widget.id,
                key,
                prop: WidgetModel.getDefaultProp('static', widgetConfig),
              },
            });
          }
        }
      });
    });
  });

  // TODO do variables
};

// Triggered from change in variables

export const resetVariableFunctionArgsUsingVariable = (variableId: string): any => (
  dispatch: Dispatch<UpdateVariableFunctionArg>,
  getState: TGetState,
) => {
  const state = getState();

  Object.keys(state.variable).forEach((vId) => {
    const variable = state.variable[vId];
    if (variable.type === 'function') {
      variable.args.forEach((a, i) => {
        if (a.type === 'variable' && a.variableId === variableId) {
          const arg: FunctionVariable$StaticArg = (() => {
            const argConfig = state.configuration.functions.find(
              (f) => f.name === variable.functionId,
            )?.args[i];
            if (!argConfig) throw new Error();
            switch (argConfig.type) {
              case 'string': {
                return { type: 'static', valueType: 'string', value: '' } as const;
              }
              case 'number': {
                return { type: 'static', valueType: 'number', value: 0 } as const;
              }
              case 'boolean': {
                return { type: 'static', valueType: 'boolean', value: true } as const;
              }
              default:
                throw new Error();
            }
          })();
          dispatch({
            type: UPDATE_VARIABLE_FUNCTION_ARG,
            payload: {
              variableId: vId,
              index: i,
              arg,
            },
          });
        }
      });
    }
  });
};

export const resetWidgetPropsUsingVariable = (variableId: string): any => (
  dispatch: Dispatch<UpdateWidgetProps>,
  getState: TGetState,
) => {
  const state = getState();

  const widgets = Object.keys(state.widget).reduce<
    { widget: Widget | CustomComponentInstance; rootId: string; keys: string[] }[]
  >((acc, cur) => {
    return [
      ...acc,
      ...Object.keys(state.widget[cur]).reduce<
        { widget: Widget | CustomComponentInstance; rootId: string; keys: string[] }[]
      >((a, c) => {
        const widget = state.widget[cur][c];
        const keys = Object.keys(widget.props).filter((k) => {
          const prop = widget.props[k];
          return prop.mode === 'variable' && prop.variableId === variableId;
        });
        if (keys.length > 0) {
          return [...a, { widget, rootId: cur, keys }];
        }
        return a;
      }, []),
    ];
  }, []);

  widgets.forEach((w) => {
    w.keys.forEach((k) => {
      const widgetConfig: ComponentConfig = (() => {
        const ww = w.widget;
        if (ww.type === 'widget') {
          const conf = state.configuration.components
            .find((c) => c.library === ww.library)
            ?.config?.find((c) => c.key === k);
          if (!conf) throw new Error();
          return conf;
        }
        const conf = state.customComponent[ww.customComponentId].config?.find((c) => c.key === k);
        if (!conf) throw new Error();
        return conf;
      })();
      dispatch({
        type: UPDATE_WIDGET_PROPS,
        payload: {
          rootId: w.rootId,
          widgetId: w.widget.id,
          key: k,
          prop: WidgetModel.getDefaultProp('static', widgetConfig),
        },
      });
    });
  });
};
