export const ADD_WIDGET = 'ADD_WIDGET';
export const ADD_LAYOUT = 'ADD_LAYOUT';
export const UPDATE_ELEMENT_NAME = 'UPDATE_ELEMENT_NAME';
export const UPDATE_ELEMENT = 'UPDATE_ELEMENT';
export const SELECT_ELEMENT = 'SELECT_ELEMENT';

const defaultLayoutConfig = {
  grid: {},
  flex: {},
};

const defaultComponentConfig = {
  text: {
    children: '',
  },
};

interface AddLayout {
  type: 'ADD_LAYOUT';
  payload: {
    name: string;
    layoutType: 'grid' | 'flex';
    parent: string;
  };
}

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

interface AddWidget {
  type: 'ADD_WIDGET';
  payload: {
    name: string;
    component: string;
    parent: string;
    [key: string]: any;
  };
}

export const addWidget = (component: 'text', parent: string): AddWidget => {
  const name = 'generate_default_name';
  const defaultConfig = defaultComponentConfig[component];
  return {
    type: ADD_WIDGET,
    payload: {
      name,
      component,
      parent,
      ...defaultConfig,
    },
  };
};

interface UpdateElement {
  type: 'UPDATE_ELEMENT';
  payload: {
    name: string;
    type: 'widget' | 'layout' | 'page';
    key: string;
    value: any;
  };
}

export const updateElement = (
  name: string,
  type: 'widget' | 'layout' | 'page',
  key: string,
  value: any,
): UpdateElement => {
  return {
    type: UPDATE_ELEMENT,
    payload: {
      name,
      type,
      key,
      value,
    },
  };
};

interface UpdateElementName {
  type: 'UPDATE_ELEMENT_NAME';
  payload: {
    currentName: string;
    type: 'widget' | 'layout' | 'page';
    name: string;
  };
}

export const updateElementName = (
  currentName: string,
  type: 'widget' | 'layout' | 'page',
  name: string,
): UpdateElementName => {
  return {
    type: UPDATE_ELEMENT_NAME,
    payload: {
      currentName,
      name,
      type,
    },
  };
};

interface SelectElement {
  type: 'SELECT_ELEMENT';
  payload: string;
}

export const selectElement = (name: string): SelectElement => ({
  type: SELECT_ELEMENT,
  payload: name,
});

export type Action$Element =
  | AddLayout
  | AddWidget
  | SelectElement
  | UpdateElement
  | UpdateElementName;
