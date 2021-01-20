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
  options: { value: string; label: string }[];
}

export type ComponentConfig = ComponentConfig$Input | ComponentConfig$Select;

export interface Component {
  name: string;
  description: string;
  category: string;
  library: string;
  icon: string;
  config: ComponentConfig[];
}