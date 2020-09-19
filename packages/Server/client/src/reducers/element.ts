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
    p_page1: { id: ids[0], type: 'page', name: 'p_page1', props: {} },
  },
  widget: {
    w_widget1: {
      type: 'widget',
      id: ids[1],
      name: 'w_widget1',
      parent: 'l_flex1',
      component: 'text',
      dependencies: emptyDeps,
      props: { children: '' },
    },
    w_widget2: {
      id: ids[2],
      type: 'widget',
      name: 'w_widget2',
      parent: 'l_flex1',
      component: 'text',
      dependencies: emptyDeps,
      props: { children: '' },
    },
    w_widget3: {
      id: ids[3],
      type: 'widget',
      name: 'w_widget3',
      parent: 'l_flex2',
      component: 'text',
      dependencies: emptyDeps,
      props: { children: '' },
    },
    w_widget4: {
      id: ids[4],
      type: 'widget',
      name: 'w_widget4',
      parent: 'l_grid1',
      component: 'text',
      dependencies: emptyDeps,
      props: { children: '' },
    },
  },
  layout: {
    l_grid1: {
      id: ids[5],
      type: 'layout',
      layoutType: 'grid',
      name: 'l_grid1',
      parent: 'p_page1',
      dependencies: emptyDeps,
      props: {},
    },
    l_flex1: {
      id: ids[6],
      type: 'layout',
      layoutType: 'flex',
      name: 'l_flex1',
      parent: 'l_grid1',
      dependencies: emptyDeps,
      props: {},
    },
    l_flex2: {
      id: ids[7],
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
      const page = Object.keys(state.page).reduce((acc, cur) => {
        if (cur === action.payload.id) return acc;
        return { ...acc, [cur]: state.page[cur] };
      }, {});

      const layout = Object.keys(state.layout).reduce(
        (acc, cur) => {
          if (cur === action.payload.id) return acc;
          if (state.layout[cur].parent === action.payload.id) {
            return {
              ...acc,
              [cur]: {
                ...state.layout[cur],
                parent: action.payload.name,
              },
            };
          }
          return { ...acc, [cur]: state.layout[cur] };
        },
        action.payload.type === 'layout'
          ? {
              [action.payload.name]: {
                ...state.layout[action.payload.id],
                name: action.payload.name,
              },
            }
          : {},
      );

      const widget = Object.keys(state.widget).reduce(
        (acc, cur) => {
          if (cur === action.payload.id) return acc;
          if (state.widget[cur].parent === action.payload.id) {
            return {
              ...acc,
              [cur]: {
                ...state.widget[cur],
                parent: action.payload.name,
              },
            };
          }
          return { ...acc, [cur]: state.widget[cur] };
        },
        action.payload.type === 'widget'
          ? {
              [action.payload.name]: {
                ...state.widget[action.payload.id],
                name: action.payload.name,
              },
            }
          : {},
      );

      return {
        ...state,
        selectedElement:
          state.selectedElement === action.payload.id ? action.payload.name : state.selectedElement,
        page,
        layout,
        widget,
      };
    }
    default:
      return state;
  }
};

export default element;
