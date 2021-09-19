import { v4 as uuidv4 } from 'uuid';
import {
  Element,
  BaseStyle,
  CustomComponent,
  CustomComponentInstance,
  ComponentConfig,
} from '@ui-studio/types';
import { generateDefaultName } from 'selectors/element';
import { getSelectedRootElement } from 'selectors/tree';
import { Store } from 'types/store';
import { StylesModel } from 'models/styles';
import { WidgetModel } from 'models/widget';

export class CustomComponentModel {
  static getDefaultCustomComponent = (state: Store): CustomComponent => {
    return {
      id: uuidv4(),
      rootElement: true,
      type: 'customComponent',
      name: generateDefaultName(state, 'Component'),
      config: [],
      style: StylesModel.getDefaultStyle() as BaseStyle,
    };
  };

  static getDefaultCustomComponentInstance = (
    state: Store,
    component: CustomComponent,
    parentElement: Element,
  ): CustomComponentInstance => {
    return {
      id: uuidv4(),
      rootElement: false,
      type: 'customComponentInstance',
      customComponentId: component.id,
      parent: parentElement.id,
      name: WidgetModel.getDefaultName(state, component.name),
      position: WidgetModel.getNextPosition(state, parentElement.id),
      props: WidgetModel.getDefaultProps(component.config || []),
      events: WidgetModel.getDefaultEvents([]),
      style: StylesModel.getDefaultStyle(parentElement),
      layout: null,
      hasChildren: false,
    };
  };

  static getDefaultCustomComponentConfig = (state: Store): ComponentConfig => {
    const root = getSelectedRootElement(state);
    if (!root || root.type !== 'customComponent') throw Error();

    const key = uuidv4();

    const label = (() => {
      const pattern = new RegExp('Config ([0-9]*)');
      const names = root.config?.map((c) => c.key) ?? [];
      const matchingNames = names.filter((n) => pattern.test(n));
      const indicies = matchingNames.map((n) => pattern.exec(n)?.[1]).filter((n) => n);
      return `Config ${
        indicies.length === 0 ? 1 : Math.max(...indicies.map((n) => Number(n))) + 1
      }`;
    })();

    return {
      key,
      label,
      defaultValue: '',
      schema: { type: 'string' as const },
      iterable: false,
    };
  };
}
