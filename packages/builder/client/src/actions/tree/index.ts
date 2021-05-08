import { UpdateRootStyle, UpdateWidgetStyle } from 'actions/tree/styles';
import { AddWidgetEvent, UpdateWidgetEvent, RemoveWidgetEvent } from 'actions/tree/event';
import { UpdateWidgetLayoutType, UpdateWidgetLayoutConfig } from 'actions/tree/layout';
import { ADD_ROOT, REMOVE_ROOT, AddRoot, RemoveRoot } from 'actions/tree/root';
import {
  AddWidget,
  RemoveWidget,
  UpdateWidgetProps,
  UpdateWidgetParent,
  UpdateWidgetPosition,
} from 'actions/tree/widget';
import { UpdateRootName, UpdateWidgetName } from 'actions/tree/name';
import { InitClient } from 'actions/tree/init';

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
  | InitClient;
