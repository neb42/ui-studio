import { Component, ActionDefinition, FunctionDefinition } from '@ui-studio/types';

import { Store } from 'types/store';

export const getComponents = (state: Store): Component[] => state.configuration.components;

export const getActions = (state: Store): ActionDefinition[] => state.configuration.actions;

export const getFunctions = (state: Store): FunctionDefinition[] => state.configuration.functions;
