import { v4 as uuidv4 } from 'uuid';
import { Element, BaseStyle, CustomComponent, CustomComponentInstance } from '@ui-studio/types';
import { generateDefaultName } from 'selectors/element';
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
}
