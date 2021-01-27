import { combineReducers } from 'redux';

import { widget } from './widget';
import { page } from './page';
import { layout } from './layout';
import { variable } from './variable';

const rootReducer = combineReducers({
  widget,
  page,
  layout,
  variable,
});

export default rootReducer;
