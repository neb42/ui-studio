import { combineReducers, Reducer } from 'redux';
import { Store } from 'types/store';

import { element } from './element';
import { page } from './page';
import { overlay } from './overlay';
import { layout } from './layout';
import { widget } from './widget';

const rootReducer: Reducer<Store> = combineReducers({
  element,
  page,
  overlay,
  layout,
  widget,
});

export default rootReducer;
