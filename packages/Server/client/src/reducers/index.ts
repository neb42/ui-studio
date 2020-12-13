import { combineReducers, Reducer } from 'redux';
import { Store } from 'types/store';
import { Action$Element } from 'actions/element';
import { Action$Layout } from 'actions/layout';
import { Action$Widget } from 'actions/widget';

import { element } from './element';
import { page } from './page';
import { overlay } from './overlay';
import { layout } from './layout';
import { widget } from './widget';

type AllActions = Action$Element | Action$Layout | Action$Widget;

const rootReducer: Reducer<Store, AllActions> = combineReducers({
  element,
  page,
  overlay,
  layout,
  widget,
});

export default rootReducer;
