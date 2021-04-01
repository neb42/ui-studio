import { v4 as uuidv4 } from 'uuid';
import {
  Element,
  Event,
  Component,
  ComponentConfig,
  Widget,
  WidgetProp,
  WidgetProp$Static,
  Mode,
  WidgetProp$Widget,
  WidgetProp$Variable,
  WidgetProp$Complex,
  WidgetProp$List,
  WidgetProp$Iterable,
} from 'canvas-types';
import { generateDefaultName, getNextPosition } from 'selectors/element';
import { StylesModel } from 'models/styles';
import { LayoutModel } from 'models/layout';
import { Store } from 'types/store';

export class WidgetModel {
  static getDefaultWidget = (
    state: Store,
    component: Component,
    library: string,
    parentElement: Element,
  ): Widget => {
    return {
      id: uuidv4(),
      type: 'widget',
      library,
      hasChildren: Boolean(component.hasChildren),
      component: component.key,
      parent: parentElement.id,
      name: WidgetModel.getDefaultName(state, component.name),
      position: WidgetModel.getNextPosition(state, parentElement.id),
      props: WidgetModel.getDefaultProps(component),
      events: WidgetModel.getDefaultEvents(component),
      style: StylesModel.getDefaultStyle(parentElement),
      layout: component.hasLayout ? LayoutModel.getDefaultLayout('flex') : null,
    };
  };

  static getIsIterable = (config: ComponentConfig): boolean => {
    if (config.list || (config.component !== 'complex' && config.type === 'object')) {
      return Boolean(config.iterable);
    }
    return false;
  };

  static getDefaultName = (state: Store, name: string): string => {
    return generateDefaultName(
      state,
      name.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()),
    );
  };

  static getNextPosition = (state: Store, parentId: string): number => {
    return getNextPosition(state, parentId);
  };

  static getDefaultEvents = (
    component: Component,
  ): {
    [key: string]: Event[];
  } => {
    return component.events?.reduce((acc, cur) => ({ ...acc, [cur.key]: [] }), {}) ?? {};
  };

  static getDefaultProps = (component: Component): { [key: string]: WidgetProp } => {
    return (
      component.config?.reduce((acc, cur) => {
        const mode = (() => {
          if (cur.list) return 'list';
          if (cur.component === 'complex') return 'complex';
          return 'static';
        })();
        return { ...acc, [cur.key]: WidgetModel.getDefaultProp(mode, cur) };
      }, {}) ?? {}
    );
  };

  static getDefaultProp = (
    mode: Mode,
    config: ComponentConfig,
    widgetProp?: WidgetProp = null, // TODO prefill with existing values
  ): WidgetProp => {
    switch (mode) {
      case 'complex': {
        if (config.component !== 'complex') throw Error();
        return {
          mode: 'complex',
          props: config.config.reduce((acc, cur) => {
            return {
              ...acc,
              [cur.key]: { mode: 'static', type: cur.type, value: cur.defaultValue },
            };
          }, {}),
          iterable: false,
        } as WidgetProp$Complex;
      }
      case 'list': {
        return {
          mode: 'list',
          props: [],
          iterable: WidgetModel.getIsIterable(config),
        } as WidgetProp$List;
      }
      case 'static': {
        if (config.list) {
          return {
            mode: 'static',
            type: 'object',
            value: JSON.stringify([], null, 2),
            iterable: WidgetModel.getIsIterable(config),
          } as WidgetProp$Static;
        }
        if (config.component === 'complex') {
          return {
            mode: 'static',
            type: 'object',
            value: JSON.stringify(
              config.config.reduce((acc, cur) => {
                return {
                  ...acc,
                  [cur.key]: cur.defaultValue,
                };
              }, {}),
              null,
              2,
            ),
            iterable: WidgetModel.getIsIterable(config),
          } as WidgetProp$Static;
        }
        return {
          mode: 'static',
          type: config.type,
          value: config.defaultValue,
          iterable: config.type === 'object' ? WidgetModel.getIsIterable(config) : false,
        } as WidgetProp$Static;
      }
      case 'variable': {
        return {
          mode: 'variable',
          type: 'string',
          variableId: '',
          iterable: false,
        } as WidgetProp$Variable;
      }
      case 'widget': {
        return {
          mode: 'widget',
          widgetId: '',
          lookup: '',
          iterable: false,
        } as WidgetProp$Widget;
      }
      case 'iterable': {
        return {
          mode: 'iterable',
          widgetId: '',
          propKey: '',
          lookup: '',
        } as WidgetProp$Iterable;
      }
      default:
        throw Error();
    }
  };
}
