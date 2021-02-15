import { combineReducers } from 'redux';

import { widget } from './widget';
import { page } from './page';
import { layout } from './layout';
import { variable } from './variable';
import { development } from './development';

const rootReducer = combineReducers({
  widget,
  page,
  layout,
  variable,
  development,
});

export default rootReducer;
