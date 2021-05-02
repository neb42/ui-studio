import { combineReducers, Reducer } from 'redux';

import { Store } from 'types/store';
import { Action$Variable } from 'actions/variable';
import { Action$View } from 'actions/view';

import { tree } from './tree';
import { variable } from './variable';
import { view } from './view';
import { configuration } from './configuration';

type AllActions = Action$Tree | Action$Variable | Action$View;

const rootReducer: Reducer<Store, AllActions> = combineReducers({
  tree,
  variable,
  view,
  configuration,
});

export default rootReducer;
