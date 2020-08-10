import {
  ADD_WIDGET,
  ADD_LAYOUT,
  SELECT_ELEMENT,
  UPDATE_ELEMENT,
  UPDATE_ELEMENT_NAME,
  Action$Element,
} from 'actions/element';
import { Store$Element } from 'types/store';

const emptyDeps = {
  queries: [],
  serverFunctions: [],
  clientFunctions: [],
  widgets: [],
};

const initialState: Store$Element = {
  selectedElement: null,
  page: {
    p_page1: { type: 'page', name: 'p_page1', props: {} },
  },
  widget: {
    w_widget1: {
      type: 'widget',
      name: 'w_widget1',
      parent: 'l_flex1',
      component: 'text',
      dependencies: emptyDeps,
      props: { children: '' },
    },
    w_widget2: {
      type: 'widget',
      name: 'w_widget2',
      parent: 'l_flex1',
      component: 'text',
      dependencies: emptyDeps,
      props: { children: '' },
    },
    w_widget3: {
      type: 'widget',
      name: 'w_widget3',
      parent: 'l_flex2',
      component: 'text',
      dependencies: { ...emptyDeps, queries: ['q_query1'] },
      props: { children: '' },
    },
    w_widget4: {
      type: 'widget',
      name: 'w_widget4',
      parent: 'l_grid1',
      component: 'text',
      dependencies: {
        ...emptyDeps,
        clientFunctions: ['f_clientFunc2'],
        serverFunctions: ['f_serverFunc1'],
      },
      props: { children: '' },
    },
  },
  layout: {
    l_grid1: {
      type: 'layout',
      layoutType: 'grid',
      name: 'l_grid1',
      parent: 'p_page1',
      dependencies: emptyDeps,
      props: {},
    },
    l_flex1: {
      type: 'layout',
      layoutType: 'flex',
      name: 'l_flex1',
      parent: 'l_grid1',
      dependencies: emptyDeps,
      props: {},
    },
    l_flex2: {
      type: 'layout',
      layoutType: 'flex',
      name: 'l_flex2',
      parent: 'l_grid1',
      dependencies: emptyDeps,
      props: {},
    },
  },
};

const element = (state: Store$Element = initialState, action: Action$Element) => {
  switch (action.type) {
    case ADD_WIDGET: {
      return {
        ...state,
        widgets: {
          ...state.widget,
          [action.payload.name]: action.payload,
        },
      };
    }
    case ADD_LAYOUT: {
      return {
        ...state,
        layouts: {
          ...state.layout,
          [action.payload.name]: action.payload,
        },
      };
    }
    case SELECT_ELEMENT: {
      return {
        ...state,
        selectedElement: action.payload,
      };
    }
    case UPDATE_ELEMENT: {
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          [action.payload.name]: {
            ...state[action.payload.type][action.payload.name],
            props: {
              ...state[action.payload.type][action.payload.name].props,
              [action.payload.key]: action.payload.value,
            },
          },
        },
      };
    }
    case UPDATE_ELEMENT_NAME: {
      const { [action.payload.currentName]: current, ...other } = state[action.payload.type];
      return {
        ...state,
        selectedElement: action.payload.name,
        [action.payload.type]: {
          ...other,
          [action.payload.name]: {
            ...current,
            name: action.payload.name,
          },
        },
      };
    }
    default:
      return state;
  }
};

export default element;
