import { combineReducers } from 'redux';

import { root } from './root';
import { widget } from './widget';
import { variable } from './variable';
import { development } from './development';

const rootReducer = combineReducers({
  root,
  widget,
  variable,
  development,
});

export default rootReducer;
