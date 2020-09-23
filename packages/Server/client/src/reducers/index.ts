import { combineReducers } from 'redux';

import { element } from './element';
import { page } from './page';
import { layout } from './layout';
import { widget } from './widget';

const rootReducer = combineReducers({ element, page, layout, widget });

export default rootReducer;
