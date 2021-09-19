import { v4 as uuidv4 } from 'uuid';
import {
  Element,
  Event,
  Component,
  ComponentConfig,
  Component$Event,
  Widget,
  WidgetProp,
  Value$Static,
  Mode,
  Value$Widget,
  Value$Variable,
  Value$Complex,
  Value$List,
  Value$Iterable,
  TStyle,
  CustomComponentInstance,
  Value$CustomComponentConfig,
} from '@ui-studio/types';
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
      rootElement: false,
      type: 'widget',
      library,
      hasChildren: Boolean(component.hasChildren),
      component: component.key,
      parent: parentElement.id,
      name: WidgetModel.getDefaultName(state, component.name),
      position: WidgetModel.getNextPosition(state, parentElement.id),
      props: WidgetModel.getDefaultProps(component.config || []),
      events: WidgetModel.getDefaultEvents(component.events || []),
      style: StylesModel.getDefaultStyle(parentElement),
      layout: component.hasLayout ? LayoutModel.getDefaultLayout('flex') : null,
    };
  };

  static getIsIterable = (config: ComponentConfig): boolean => {
    return Boolean(config.iterable);
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
    events: Component$Event[],
  ): {
    [key: string]: Event[];
  } => {
    return events.reduce((acc, cur) => ({ ...acc, [cur.key]: [] }), {}) ?? {};
  };

  static getDefaultProps = (config: ComponentConfig[]): { [key: string]: WidgetProp } => {
    return (
      config.reduce((acc, cur) => {
        const mode = (() => {
          if (cur.schema.type === 'array' || cur.schema.type === 'object') return 'form';
          return 'static';
        })();
        return { ...acc, [cur.key]: WidgetModel.getDefaultProp(mode, cur) };
      }, {}) ?? {}
    );
  };

  static getDefaultProp = (
    mode: Mode,
    config: ComponentConfig,
    widgetProp: WidgetProp | null = null, // TODO prefill with existing values
  ): WidgetProp => {
    switch (mode) {
      case 'form': {
        if (config.schema.type === 'object') {
          return {
            mode: 'complex',
            props: config.defaultValue,
          } as Value$Complex;
        }
        if (config.schema.type === 'array') {
          return {
            mode: 'list',
            props: [],
          } as Value$List;
        }
        throw new Error();
      }
      case 'static': {
        if (config.schema.type === 'array') {
          return {
            mode: 'static',
            value: JSON.stringify([], null, 2),
          } as Value$Static;
        }
        if (config.schema.type === 'object') {
          const { properties } = config.schema;
          if (!properties) throw new Error();
          return {
            mode: 'static',
            value: config.defaultValue,
          } as Value$Static;
        }
        return {
          mode: 'static',
          value: config.defaultValue,
        } as Value$Static;
      }
      case 'variable': {
        return {
          mode: 'variable',
          type: 'string',
          variableId: '',
          iterable: false,
        } as Value$Variable;
      }
      case 'widget': {
        return {
          mode: 'widget',
          widgetId: '',
          property: '',
          iterable: false,
        } as Value$Widget;
      }
      case 'iterable': {
        return {
          mode: 'iterable',
          widgetId: '',
          propKey: '',
          lookup: '',
        } as Value$Iterable;
      }
      case 'customComponentConfig': {
        return {
          mode: 'customComponentConfig',
          configKey: '',
        } as Value$CustomComponentConfig;
      }
      default:
        throw Error();
    }
  };

  static updatePosition = (
    widget: Widget | CustomComponentInstance,
    movingElementId: string,
    source: {
      parentId: string;
      position: number;
    },
    destination: {
      parentId: string;
      position: number;
    },
    style: TStyle,
  ): Widget | CustomComponentInstance => {
    // The element being moved
    if (widget.id === movingElementId) {
      return {
        ...widget,
        parent: destination.parentId,
        position: destination.position,
        style,
      };
    }
    // The element is being moved within it's current parent element
    if (destination.parentId === source.parentId) {
      if (widget.parent === destination.parentId) {
        const position = (() => {
          let p = widget.position;
          if (p > source.position) p -= 1;
          if (p >= destination.position) p += 1;
          return p;
        })();
        return {
          ...widget,
          position,
        };
      }
    }
    // The element has been moved into this element's parent
    if (widget.parent === destination.parentId) {
      return {
        ...widget,
        position: widget.position >= destination.position ? widget.position + 1 : widget.position,
      };
    }
    // The element has been moved out of this element's parent
    if (widget.parent === source.parentId) {
      return {
        ...widget,
        position: widget.position > source.position ? widget.position - 1 : widget.position,
      };
    }
    return widget;
  };
}
