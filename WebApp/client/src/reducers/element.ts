import { ADD_WIDGET, ADD_LAYOUT, SELECT_ELEMENT, Action$Element } from 'actions/element';
import { Store$Element } from 'types/store';

const emptyDeps = {
  queries: [],
  serverFunctions: [],
  clientFunctions: [],
  widgets: [],
};

const initialState: Store$Element = {
  selectedElement: null,
  pages: {
    p_page1: { type: 'page', name: 'p_page1' },
  },
  widgets: {
    w_widget1: {
      type: 'widget',
      name: 'w_widget1',
      parent: 'l_flex1',
      component: 'text',
      dependencies: emptyDeps,
    },
    w_widget2: {
      type: 'widget',
      name: 'w_widget2',
      parent: 'l_flex1',
      component: 'text',
      dependencies: emptyDeps,
    },
    w_widget3: {
      type: 'widget',
      name: 'w_widget3',
      parent: 'l_flex2',
      component: 'text',
      dependencies: { ...emptyDeps, queries: ['q_query1'] },
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
    },
  },
  layouts: {
    l_grid1: {
      type: 'layout',
      layoutType: 'grid',
      name: 'l_grid1',
      parent: 'p_page1',
      dependencies: emptyDeps,
    },
    l_flex1: {
      type: 'layout',
      layoutType: 'flex',
      name: 'l_flex1',
      parent: 'l_grid1',
      dependencies: emptyDeps,
    },
    l_flex2: {
      type: 'layout',
      layoutType: 'flex',
      name: 'l_flex2',
      parent: 'l_grid1',
      dependencies: emptyDeps,
    },
  },
};

const element = (state: Store$Element = initialState, action: Action$Element) => {
  switch (action.type) {
    case ADD_WIDGET: {
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.payload.name]: action.payload,
        },
      };
    }
    case ADD_LAYOUT: {
      return {
        ...state,
        layouts: {
          ...state.layouts,
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
    default:
      return state;
  }
};

export default element;
