import { ComponentConfig, WidgetProp, Mode } from 'canvas-types';

export class Widget {
  static buildDefaultWidget = (component, library, parent, config) => {};

  static getDefaultProp = (
    mode: Mode,
    config: ComponentConfig,
    widgetProp?: WidgetProp = null,
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
