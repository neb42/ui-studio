import { TStyle } from './style';
import { Event } from './event';
import { Layout } from './layout';

export type Mode =
  | 'complex'
  | 'list'
  | 'static'
  | 'variable'
  | 'widget'
  | 'iterable'
  | 'customComponentConfig';

export type WidgetProp$Static = {
  mode: 'static';
} & (
  | { type: 'string'; value: string; iterable: false }
  | { type: 'number'; value: number; iterable: false }
  | { type: 'boolean'; value: boolean; iterable: false }
  | { type: 'object'; value: string; iterable: boolean }
);

export type WidgetProp$Variable = {
  mode: 'variable';
} & (
  | { type: 'string' | 'number' | 'boolean'; variableId: string; iterable: false }
  | { type: 'object'; variableId: string; lookup: string; iterable: boolean }
);

export type WidgetProp$Widget = {
  mode: 'widget';
  widgetId: string;
  lookup: string;
  iterable: false;
};

export type WidgetProp$CustomComponentConfig = {
  mode: 'customComponentConfig';
  configKey: string;
};

export type WidgetProp$Complex = {
  mode: 'complex';
  props: {
    [key: string]:
      | WidgetProp$Static
      | WidgetProp$Variable
      | WidgetProp$Widget
      | WidgetProp$CustomComponentConfig;
  };
  iterable: false;
};

export type WidgetProp$List = {
  mode: 'list';
  iterable: boolean;
  props: (
    | WidgetProp$Static
    | WidgetProp$Variable
    | WidgetProp$Widget
    | WidgetProp$Complex
    | WidgetProp$CustomComponentConfig
  )[];
};

export type WidgetProp$Iterable = {
  mode: 'iterable';
  iterable: false;
  widgetId: string;
  propKey: string;
  lookup: string;
};

export type WidgetProp =
  | WidgetProp$Static
  | WidgetProp$Variable
  | WidgetProp$Widget
  | WidgetProp$List
  | WidgetProp$Complex
  | WidgetProp$Iterable
  | WidgetProp$CustomComponentConfig;

export interface Widget {
  id: string;
  rootElement: false;
  type: 'widget';
  name: string;
  parent: string;
  component: string;
  library: string;
  props: { [key: string]: WidgetProp };
  events: {
    [key: string]: Event[];
  };
  layout: Layout;
  position: number;
  style: TStyle;
  hasChildren: boolean;
}
