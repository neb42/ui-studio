import { TStyle } from './style';
import { Event } from './event';

export type WidgetProp$Static = {
  mode: 'static';
} & (
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'object'; value: string }
);

export type WidgetProp$Variable = {
  mode: 'variable';
} & (
  | { type: 'string' | 'number' | 'boolean'; variableId: string }
  | { type: 'object'; variableId: string; lookup: string }
);

export type WidgetProp$Widget = {
  mode: 'widget';
  widgetId: string;
  lookup: string;
};

export type WidgetProp$List = {
  mode: 'list';
  props: (WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget)[];
};

export type WidgetProp =
  | WidgetProp$Static
  | WidgetProp$Variable
  | WidgetProp$Widget
  | WidgetProp$List;

export interface Widget {
  id: string;
  type: 'widget';
  name: string;
  parent: string;
  component: string;
  library: string;
  props: { [key: string]: WidgetProp };
  events: {
    [key: string]: Event[];
  };
  position: number;
  style: TStyle;
  hasChildren: boolean;
}
