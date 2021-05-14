import { Dispatch } from 'redux';
import {
  CustomComponent,
  ComponentConfig,
  CustomComponent$ExposedProperties,
  CustomComponentInstance,
} from '@ui-studio/types';
import { selectRootElement, SelectRootElement, selectElement, SelectElement } from 'actions/view';
import { getSelectedRootId } from 'selectors/view';
import { getRoots, getSelectedRootElement } from 'selectors/tree';
import { CustomComponentModel } from 'models/customComponent';
import { TGetState, TThunkAction } from 'types/store';
import { UpdateCustomComponentName } from 'actions/name';
import { UpdateCustomComponentStyle } from 'actions/styles';
import { InitClient } from 'actions/init';
import { removeWidget, RemoveWidget } from 'actions/widget';

export interface AddCustomComponent {
  type: 'ADD_CUSTOM_COMPONENT';
  payload: CustomComponent;
}

export const ADD_CUSTOM_COMPONENT = 'ADD_CUSTOM_COMPONENT';

export const addCustomComponent = (): TThunkAction<AddCustomComponent> => (
  dispatch: Dispatch<AddCustomComponent | SelectRootElement | SelectElement>,
  getState: TGetState,
) => {
  const state = getState();
  const customcomponent = CustomComponentModel.getDefaultCustomComponent(state);

  dispatch(selectRootElement(customcomponent.id));
  dispatch(selectElement(customcomponent.id));

  return dispatch({
    type: ADD_CUSTOM_COMPONENT,
    payload: customcomponent,
  });
};

export interface RemoveCustomComponent {
  type: 'REMOVE_CUSTOM_COMPONENT';
  payload: string;
}

export const REMOVE_CUSTOM_COMPONENT = 'REMOVE_CUSTOM_COMPONENT';

export const removeCustomComponent = (rootId: string): TThunkAction<RemoveCustomComponent> => (
  dispatch: Dispatch<RemoveCustomComponent | SelectRootElement | SelectElement | RemoveWidget>,
  getState: TGetState,
) => {
  const state = getState();
  const selectedRootElementId = getSelectedRootId(state);
  if (selectedRootElementId === rootId) {
    const firstRootId = getRoots(state).filter((p) => p.id !== selectedRootElementId)[0].id;
    dispatch(selectRootElement(firstRootId));
    dispatch(selectElement(firstRootId));
  }

  const customComponentInstances = Object.keys(state.widget).reduce<CustomComponentInstance[]>(
    (acc, cur) => {
      return [
        ...acc,
        ...Object.values(state.widget[cur]).filter(
          (w): w is CustomComponentInstance =>
            w.type === 'customComponentInstance' && w.customComponentId === rootId,
        ),
      ];
    },
    [],
  );

  customComponentInstances.forEach((c) => {
    dispatch(removeWidget(c) as any); // TODO fix type
  });

  return dispatch({
    type: REMOVE_CUSTOM_COMPONENT,
    payload: rootId,
  });
};

export interface AddExposedProperty {
  type: 'ADD_EXPOSED_PROPERTY';
  payload: {
    rootId: string;
    key: string;
    exposedProperty: CustomComponent$ExposedProperties;
  };
}

export const ADD_EXPOSED_PROPERTY = 'ADD_EXPOSED_PROPERTY';

export const addExposedProperty = (
  widgetId: string,
  property: string,
): TThunkAction<AddExposedProperty> => (
  dispatch: Dispatch<AddExposedProperty>,
  getState: TGetState,
) => {
  const state = getState();

  const root = getSelectedRootElement(state);
  if (!root || root.type !== 'customComponent') throw Error();

  const key = (() => {
    const pattern = new RegExp('Property ([0-9]*)');
    const names = Object.keys(root.exposedProperties || {});
    const matchingNames = names.filter((n) => pattern.test(n));
    const indicies = matchingNames.map((n) => pattern.exec(n)?.[1]).filter((n) => n);
    return `Property ${
      indicies.length === 0 ? 1 : Math.max(...indicies.map((n) => Number(n))) + 1
    }`;
  })();

  return dispatch({
    type: ADD_EXPOSED_PROPERTY,
    payload: {
      rootId: root.id,
      key,
      exposedProperty: {
        widgetId,
        property,
      },
    },
  });
};

export interface RemoveExposedProperty {
  type: 'REMOVE_EXPOSED_PROPERTY';
  payload: {
    rootId: string;
    key: string;
  };
}

export const REMOVE_EXPOSED_PROPERTY = 'REMOVE_EXPOSED_PROPERTY';

export const removeExposedProperty = (key: string): TThunkAction<RemoveExposedProperty> => (
  dispatch: Dispatch<RemoveExposedProperty>,
  getState: TGetState,
) => {
  const state = getState();

  const rootId = getSelectedRootId(state);
  if (!rootId) throw Error();

  return dispatch({
    type: REMOVE_EXPOSED_PROPERTY,
    payload: {
      rootId,
      key,
    },
  });
};

export interface UpdateExposedPropertyKey {
  type: 'UPDATE_EXPOSED_PROPERTY_KEY';
  payload: {
    rootId: string;
    oldKey: string;
    newKey: string;
  };
}

export const UPDATE_EXPOSED_PROPERTY_KEY = 'UPDATE_EXPOSED_PROPERTY_KEY';

export const updateExposedPropertyKey = (
  oldKey: string,
  newKey: string,
): TThunkAction<UpdateExposedPropertyKey> => (
  dispatch: Dispatch<UpdateExposedPropertyKey>,
  getState: TGetState,
) => {
  const state = getState();

  const rootId = getSelectedRootId(state);
  if (!rootId) throw Error();

  return dispatch({
    type: UPDATE_EXPOSED_PROPERTY_KEY,
    payload: {
      rootId,
      oldKey,
      newKey,
    },
  });
};

export interface AddCustomComponentConfig {
  type: 'ADD_CUSTOM_COMPONENT_CONFIG';
  payload: {
    rootId: string;
    config: ComponentConfig;
  };
}

export const ADD_CUSTOM_COMPONENT_CONFIG = 'ADD_CUSTOM_COMPONENT_CONFIG';

export const addCustomComponentConfig = (): TThunkAction<AddCustomComponentConfig> => (
  dispatch: Dispatch<AddCustomComponentConfig>,
  getState: TGetState,
) => {
  const state = getState();

  const rootId = getSelectedRootId(state);
  if (!rootId) throw Error();

  const config = CustomComponentModel.getDefaultCustomComponentConfig(state);

  return dispatch({
    type: ADD_CUSTOM_COMPONENT_CONFIG,
    payload: {
      rootId,
      config,
    },
  });
};

export interface UpdateCustomComponentConfig {
  type: 'UPDATE_CUSTOM_COMPONENT_CONFIG';
  payload: {
    rootId: string;
    key: string;
    config: ComponentConfig;
  };
}

export const UPDATE_CUSTOM_COMPONENT_CONFIG = 'UPDATE_CUSTOM_COMPONENT_CONFIG';

export const updateCustomComponentConfig = (
  key: string,
  config: ComponentConfig,
): TThunkAction<UpdateCustomComponentConfig> => (
  dispatch: Dispatch<UpdateCustomComponentConfig>,
  getState: TGetState,
) => {
  const state = getState();

  const rootId = getSelectedRootId(state);
  if (!rootId) throw Error();

  return dispatch({
    type: UPDATE_CUSTOM_COMPONENT_CONFIG,
    payload: {
      rootId,
      key,
      config,
    },
  });
};

export interface RemoveCustomComponentConfig {
  type: 'REMOVE_CUSTOM_COMPONENT_CONFIG';
  payload: {
    rootId: string;
    key: string;
  };
}

export const REMOVE_CUSTOM_COMPONENT_CONFIG = 'REMOVE_CUSTOM_COMPONENT_CONFIG';

export const removeCustomComponentConfig = (
  key: string,
): TThunkAction<RemoveCustomComponentConfig> => (
  dispatch: Dispatch<RemoveCustomComponentConfig>,
  getState: TGetState,
) => {
  const state = getState();

  const rootId = getSelectedRootId(state);
  if (!rootId) throw Error();

  return dispatch({
    type: REMOVE_CUSTOM_COMPONENT_CONFIG,
    payload: {
      rootId,
      key,
    },
  });
};

export type Action$CustomComponent =
  | AddCustomComponent
  | RemoveCustomComponent
  | AddExposedProperty
  | UpdateExposedPropertyKey
  | RemoveExposedProperty
  | AddCustomComponentConfig
  | UpdateCustomComponentConfig
  | RemoveCustomComponentConfig
  | UpdateCustomComponentName
  | UpdateCustomComponentStyle
  | InitClient;
