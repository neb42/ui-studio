import { combineReducers, Reducer } from 'redux';
import { Store } from 'types/store';
import { Action$Element } from 'actions/element';
import { Action$Variable } from 'actions/variable';

import { element } from './element';
import { page } from './page';
import { overlay } from './overlay';
import { widget } from './widget';
import { variable } from './variable';

type AllActions = Action$Element | Action$Widget | Action$Variable;

const rootReducer: Reducer<Store, AllActions> = combineReducers({
  element,
  page,
  overlay,
  widget,
  variable,
});

export default rootReducer;
