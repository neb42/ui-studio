import { UpdateRootStyle, UpdateWidgetStyle } from 'actions/tree/styles';
import { AddWidgetEvent, UpdateWidgetEvent, RemoveWidgetEvent } from 'actions/tree/event';
import { UpdateWidgetLayoutType, UpdateWidgetLayoutConfig } from 'actions/tree/layout';
import { AddRoot, RemoveRoot } from 'actions/tree/root';
import {
  AddWidget,
  RemoveWidget,
  UpdateWidgetProps,
  UpdateWidgetParent,
  UpdateWidgetPosition,
} from 'actions/tree/widget';
import { UpdateRootName, UpdateWidgetName } from 'actions/tree/name';
import { InitClient } from 'actions/tree/init';
import {
  AddExposedProperty,
  UpdateExposedPropertyKey,
  RemoveExposedProperty,
  AddCustomComponentConfig,
  UpdateCustomComponentConfig,
  RemoveCustomComponentConfig,
} from 'actions/tree/customComponent';

export type Action$Tree =
  | UpdateRootStyle
  | UpdateWidgetStyle
  | AddWidgetEvent
  | UpdateWidgetEvent
  | RemoveWidgetEvent
  | UpdateWidgetLayoutType
  | UpdateWidgetLayoutConfig
  | AddWidget
  | RemoveWidget
  | AddRoot
  | RemoveRoot
  | UpdateWidgetProps
  | UpdateWidgetParent
  | UpdateWidgetPosition
  | UpdateRootName
  | UpdateWidgetName
  | InitClient
  | AddExposedProperty
  | UpdateExposedPropertyKey
  | RemoveExposedProperty
  | AddCustomComponentConfig
  | UpdateCustomComponentConfig
  | RemoveCustomComponentConfig;
