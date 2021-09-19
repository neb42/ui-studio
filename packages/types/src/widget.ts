import { TStyle } from './style';
import { Event } from './event';
import { Layout } from './layout';
import {
  Value$Static,
  Value$Variable,
  Value$Widget,
  Value$List,
  Value$Complex,
  Value$Iterable,
  Value$CustomComponentConfig,
} from './value';

export type Mode = 'form' | 'static' | 'variable' | 'widget' | 'iterable' | 'customComponentConfig';

export type WidgetProp =
  | Value$Static
  | Value$Variable
  | Value$Widget
  | Value$List
  | Value$Complex
  | Value$Iterable
  | Value$CustomComponentConfig;

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
