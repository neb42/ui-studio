import {
  ADD_WIDGET,
  ADD_LAYOUT,
  SELECT_ELEMENT,
  UPDATE_ELEMENT,
  UPDATE_ELEMENT_NAME,
  Action$Element,
} from 'actions/element';
import { Store$Element } from 'types/store';
import { v4 as uuidv4 } from 'uuid';

const emptyDeps = {
  queries: [],
  serverFunctions: [],
  clientFunctions: [],
  widgets: [],
};

const ids = new Array(8).fill(1).map((_) => uuidv4());
const initialState: Store$Element = {
  selectedElement: null,
  page: {
    [ids[0]]: { id: ids[0], type: 'page', name: 'p_page1', props: {} },
  },
  widget: {
    [ids[1]]: {
      type: 'widget',
      id: ids[1],
      name: 'w_widget1',
      parent: ids[6],
      component: 'text',
      dependencies: emptyDeps,
      props: { children: '' },
    },
    [ids[2]]: {
      id: ids[2],
      type: 'widget',
      name: 'w_widget2',
      parent: ids[6],
      component: 'text',
      dependencies: emptyDeps,
      props: { children: '' },
    },
    [ids[3]]: {
      id: ids[3],
      type: 'widget',
      name: 'w_widget3',
      parent: ids[7],
      component: 'text',
      dependencies: { ...emptyDeps, queries: ['q_query1'] },
      props: { children: '' },
    },
    [ids[4]]: {
      id: ids[4],
      type: 'widget',
      name: 'w_widget4',
      parent: ids[5],
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
    [ids[5]]: {
      id: ids[5],
      type: 'layout',
      layoutType: 'grid',
      name: 'l_grid1',
      parent: ids[0],
      dependencies: emptyDeps,
      props: {},
    },
    [ids[6]]: {
      id: ids[6],
      type: 'layout',
      layoutType: 'flex',
      name: 'l_flex1',
      parent: ids[5],
      dependencies: emptyDeps,
      props: {},
    },
    [ids[7]]: {
      id: ids[7],
      type: 'layout',
      layoutType: 'flex',
      name: 'l_flex2',
      parent: ids[5],
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
        widget: {
          ...state.widget,
          [action.payload.id]: action.payload,
        },
      };
    }
    case ADD_LAYOUT: {
      return {
        ...state,
        layout: {
          ...state.layout,
          [action.payload.id]: action.payload,
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
          [action.payload.id]: {
            ...state[action.payload.type][action.payload.id],
            props: {
              ...state[action.payload.type][action.payload.id].props,
              [action.payload.key]: action.payload.value,
            },
          },
        },
      };
    }
    case UPDATE_ELEMENT_NAME: {
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          [action.payload.id]: {
            ...state[action.payload.type][action.payload.id],
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
