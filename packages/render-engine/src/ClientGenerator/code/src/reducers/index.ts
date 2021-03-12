import { combineReducers } from 'redux';

import { widget } from './widget';
import { page } from './page';
import { variable } from './variable';
import { development } from './development';

const rootReducer = combineReducers({
  widget,
  page,
  variable,
  development,
});

export default rootReducer;
