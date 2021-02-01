export interface BaseComponentConfig {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'object';
}

export interface ComponentConfig$Input extends BaseComponentConfig {
  component: 'input';
}

export interface ComponentConfig$Select extends BaseComponentConfig {
  component: 'select';
  options: { key: string; label: string }[];
}

export type ComponentConfig = ComponentConfig$Input | ComponentConfig$Select;

export type Component$Event = {
  key: string;
  label: string;
};

export interface Component {
  name: string;
  description: string;
  category: string;
  library: string;
  icon: string;
  hasChildren: boolean;
  events: Component$Event[];
  config: ComponentConfig[];
}
