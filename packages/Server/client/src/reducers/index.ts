import { combineReducers, Reducer } from 'redux';
import { Store } from 'types/store';
import { Action$Element } from 'actions/element';
import { Action$Layout } from 'actions/layout';
import { Action$Widget } from 'actions/widget';
import { Action$Variable } from 'actions/variable';

import { element } from './element';
import { page } from './page';
import { overlay } from './overlay';
import { layout } from './layout';
import { widget } from './widget';
import { variable } from './variable';

type AllActions = Action$Element | Action$Layout | Action$Widget | Action$Variable;

const rootReducer: Reducer<Store, AllActions> = combineReducers({
  element,
  page,
  overlay,
  layout,
  widget,
  variable,
});

export default rootReducer;
