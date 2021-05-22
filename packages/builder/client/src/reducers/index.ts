import { combineReducers, Reducer } from 'redux';
import { Store } from 'types/store';
import { Action$Variable } from 'actions/variable';
import { Action$View } from 'actions/view';
import { Action$Page } from 'actions/page';
import { Action$CustomComponent } from 'actions/customComponent';
import { Action$Configuration } from 'actions/configuration';
import { Action$Widget } from 'actions/widget';

import { variableReducer } from './variable';
import { view } from './view';
import { configuration } from './configuration';
import { pageReducer } from './page';
import { customComponentReducer } from './customComponent';
import { widgetReducer } from './widget';

type AllActions =
  | Action$Page
  | Action$CustomComponent
  | Action$Widget
  | Action$Variable
  | Action$View
  | Action$Configuration;

const rootReducer: Reducer<Store, AllActions> = combineReducers({
  page: pageReducer,
  customComponent: customComponentReducer,
  widget: widgetReducer,
  variable: variableReducer,
  view,
  configuration,
});

export default rootReducer;
