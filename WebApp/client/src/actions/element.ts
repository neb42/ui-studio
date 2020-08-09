export const ADD_WIDGET = 'ADD_WIDGET';
export const ADD_LAYOUT = 'ADD_LAYOUT';

const defaultLayoutConfig = {
  grid: {},
  flex: {},
};

const defaultComponentConfig = {
  text: {},
};

interface AddLayout {
  type: 'ADD_LAYOUT';
  payload: {
    name: string;
    layoutType: 'grid' | 'flex';
    parent: string;
  };
}

interface AddWidget {
  type: 'ADD_WIDGET';
  payload: {
    name: string;
    component: string;
  };
}

export type Action$Element = AddLayout | AddWidget;

export const addLayout = (layoutType: 'grid' | 'flex', parent: string): AddLayout => {
  const name = 'generate_default_name';
  return {
    type: ADD_LAYOUT,
    payload: {
      name,
      layoutType,
      parent,
      ...defaultLayoutConfig[layoutType],
    },
  };
};

export const addWidget = (component: string, parent: string): AddWidget => {
  const name = 'generate_default_name';
  // const defaultConfig = component in defaultComponentConfig ? defaultComponentConfig[component] : {};
  return {
    type: ADD_WIDGET,
    payload: {
      name,
      component,
      // ...defaultConfig,
    },
  };
};
