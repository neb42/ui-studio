import { InitFunctions, Component } from '@ui-studio/types';
import { Store$Configuration } from 'types/store';
import { InitClient } from 'actions/init';

interface IInitFunctions {
  type: 'INIT_FUNCTIONS';
  payload: InitFunctions;
}

export const INIT_FUNCTIONS = 'INIT_FUNCTIONS';

export const initFunctions = (functions: InitFunctions): IInitFunctions => ({
  type: INIT_FUNCTIONS,
  payload: functions,
});

interface IInitComponents {
  type: 'INIT_COMPONENTS';
  payload: Component[];
}

export const INIT_COMPONENTS = 'INIT_COMPONENTS';

export const initComponents = (components: Component[]): IInitComponents => ({
  type: INIT_COMPONENTS,
  payload: components,
});

export type Action$Configuration = IInitFunctions | IInitComponents | InitClient;
