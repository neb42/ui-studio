import { TStyle, BaseStyle } from './style';
import { Event } from './event';
import { Layout } from './layout';

export type CustomComponent = {
  id: string;
  type: 'customComponent';
  name: string;
  props: { [key: string]: any };
  style: BaseStyle;
};

export type CustomComponentWidgetProp$Static = {
  mode: 'static';
} & (
  | { type: 'string'; value: string; iterable: false }
  | { type: 'number'; value: number; iterable: false }
  | { type: 'boolean'; value: boolean; iterable: false }
  | { type: 'object'; value: string; iterable: boolean }
);

export type CustomComponentWidgetProp$CustomComponent = {
  key: string;
};

export type CustomComponentWidgetProp$Complex = {
  mode: 'complex';
  props: { [key: string]: CustomComponentWidgetProp$Static };
  iterable: false;
};

export type CustomComponentWidgetProp$List = {
  mode: 'list';
  iterable: boolean;
  props: (CustomComponentWidgetProp$Static | CustomComponentWidgetProp$Complex)[];
};

export type CustomComponentWidgetProp$Iterable = {
  mode: 'iterable';
  iterable: false;
  widgetId: string;
  propKey: string;
  lookup: string;
};

export type CustomComponentWidgetProp =
  | CustomComponentWidgetProp$Static
  | CustomComponentWidgetProp$List
  | CustomComponentWidgetProp$Complex
  | CustomComponentWidgetProp$Iterable;

export type CustomComponentWidget = {
  id: string;
  type: 'ustomComponentWidget';
  name: string;
  parent: string;
  CustomComponent: string;
  library: string;
  props: { [key: string]: CustomComponentWidgetProp };
  events: {
    [key: string]: Event[];
  };
  layout: Layout;
  position: number;
  style: TStyle;
  hasChildren: boolean;
};
