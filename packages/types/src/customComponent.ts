import { TStyle, BaseStyle } from './style';
import { Event } from './event';
import { Layout } from './layout';
import { ComponentConfig, Component$Event } from './components';
import { WidgetProp } from './widget';

export type CustomComponent$ExposedProperties = {
  widgetId: string;
  property: string;
};

export type CustomComponent = {
  id: string;
  rootElement: true;
  type: 'customComponent';
  name: string;
  config?: ComponentConfig[];
  events?: Component$Event[];
  exposedProperties?: Record<string, CustomComponent$ExposedProperties>;
  style: BaseStyle;
  hasChildren?: false;
  hasLayout?: false;
};

export type CustomComponentInstance = {
  id: string;
  rootElement: false;
  type: 'customComponentInstance';
  name: string;
  parent: string;
  customComponentId: string;
  props: { [key: string]: WidgetProp };
  events: {
    [key: string]: Event[];
  };
  layout: Layout;
  position: number;
  style: TStyle;
  hasChildren: boolean;
};
