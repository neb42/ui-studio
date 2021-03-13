import { v4 as uuidv4 } from 'uuid';
import { Element, Event, Component, ComponentConfig, Widget, WidgetProp, Mode } from 'canvas-types';
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
      component: component.name,
      parent: parentElement.id,
      name: WidgetModel.getDefaultName(state, component.name),
      position: WidgetModel.getNextPosition(state, parentElement.id),
      props: WidgetModel.getDefaultProps(component),
      events: WidgetModel.getDefaultEvents(component),
      style: StylesModel.getDefaultStyle(parentElement),
      layout: LayoutModel.getDefaultLayout('flex'),
    };
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
    return component.events.reduce((acc, cur) => ({ ...acc, [cur.key]: [] }), {});
  };

  static getDefaultProps = (component: Component): { [key: string]: WidgetProp } => {
    return component.config.reduce((acc, cur) => {
      const mode = (() => {
        if (cur.list) return 'list';
        if (cur.component === 'complex') return 'complex';
        return 'static';
      })();
      return { ...acc, [cur.key]: WidgetModel.getDefaultProp(mode, cur) };
    }, {});
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
        };
      }
      case 'list': {
        return {
          mode: 'list',
          props: [],
        };
      }
      case 'static': {
        if (config.list) {
          return {
            mode: 'static',
            type: 'object',
            value: JSON.stringify([], null, 2),
          };
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
          };
        }
        return {
          mode: 'static',
          type: config.type,
          value: config.defaultValue,
        };
      }
      case 'variable': {
        return {
          mode: 'variable',
          type: 'string',
          variableId: '',
        };
      }
      case 'widget': {
        return {
          mode: 'widget',
          widgetId: '',
          lookup: '',
        };
      }
      default:
        throw Error();
    }
  };
}
