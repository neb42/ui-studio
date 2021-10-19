import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IconButton } from '@mui/material';
import { AddSharp, DeleteSharp } from '@mui/icons-material';
import { OpenAPIV3 } from 'openapi-types';
import {
  Event,
  Event$UpdateVariable,
  Event$TriggerAction,
  Event$NavigatePage,
  Widget,
  Page,
  CustomComponentInstance,
  CustomComponent,
} from '@ui-studio/types';
import { getComponents, getActions, getArgTypeLookUp } from 'selectors/configuration';
import { getRoots } from 'selectors/tree';
import { getVariables } from 'selectors/variable';
import { addWidgetEvent, updateWidgetEvent, removeWidgetEvent } from 'actions/event';
import { openActionConfigurationModal } from 'actions/modal';
import { getSelectedRootId } from 'selectors/view';
import { EventModel } from 'models/event';

import * as Styles from './EventConfig.styles';

interface EventConfigInstanceProps<T extends Event> {
  event: T;
  onChange: (event: T) => void;
}

const UpdateVariableEventConfig = ({
  event,
  onChange,
}: EventConfigInstanceProps<Event$UpdateVariable>): JSX.Element => {
  const eventFunctionVariables = Object.values(useSelector(getVariables)).filter(
    (v) => v.type === 'function' && v.trigger === 'event',
  );

  const handleOnChange = (e: SelectChangeEvent) => {
    onChange({ type: 'update-variable', variableId: e.target.value as string });
  };

  const options = eventFunctionVariables.map((v) => ({ value: v.id, label: v.name }));

  return (
    <FormControl fullWidth>
      <Select value={event.variableId} onChange={handleOnChange}>
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const TriggerActionEventConfig = ({
  event,
  onChange,
  pageId,
  widgetId,
  eventKey,
  eventInstanceIndex,
}: EventConfigInstanceProps<Event$TriggerAction> & {
  pageId: string;
  widgetId: string;
  eventKey: string;
  eventInstanceIndex: number;
}): JSX.Element => {
  const dispatch = useDispatch();
  const actions = useSelector(getActions);
  const argTypeLookUp = useSelector(getArgTypeLookUp);

  const handleActionChange = (e: SelectChangeEvent) => {
    const [path, method] = (e.target.value as string).split(' ');
    const args = EventModel.getDefaultFunctionArgs(
      argTypeLookUp,
      path,
      method as OpenAPIV3.HttpMethods,
    );
    onChange({
      type: 'trigger-action',
      actionId: { path, method: method as OpenAPIV3.HttpMethods },
      args,
    });
  };

  const options = actions.map((a) => ({ value: a, label: `${a.method.toUpperCase()} ${a.path}` }));

  const handleOpenConfigureFunction = () =>
    dispatch(
      openActionConfigurationModal(
        pageId,
        widgetId,
        eventKey,
        eventInstanceIndex,
        event.actionId.path,
        event.actionId.method,
      ),
    );

  return (
    <>
      <FormControl fullWidth>
        <Select
          value={`${event.actionId.path} ${event.actionId.method}`}
          onChange={handleActionChange}
        >
          {options.map((o) => (
            <MenuItem
              key={`${o.value.path} ${o.value.method}`}
              value={`${o.value.path} ${o.value.method}`}
            >
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={handleOpenConfigureFunction}>
        Configure function
      </Button>
    </>
  );
};

const NavigatePageEventConfig = ({
  event,
  onChange,
}: EventConfigInstanceProps<Event$NavigatePage>): JSX.Element => {
  const pages = useSelector(getRoots).filter((e): e is Page => e.type === 'page');

  const handleOnChange = (e: SelectChangeEvent) => {
    onChange({ type: 'navigate-page', pageId: e.target.value as string });
  };

  const options = pages.map((p) => ({ value: p.name, label: p.name }));

  return (
    <FormControl fullWidth>
      <Select value={event.pageId} onChange={handleOnChange}>
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const eventTypes = [
  { key: 'update-variable', label: 'Update variable' },
  { key: 'trigger-action', label: 'Trigger action' },
  { key: 'navigate-page', label: 'Navigate page' },
];

interface EventConfigProps {
  widget: Widget | CustomComponentInstance;
}

export const EventConfig = ({ widget }: EventConfigProps): JSX.Element | null => {
  const dispatch = useDispatch();

  const rootId = useSelector(getSelectedRootId);
  const roots = useSelector(getRoots);
  const components = useSelector(getComponents);

  const eventConfig = (() => {
    if (widget.type === 'widget') {
      const component = components.find((c) => c.key === widget.component);
      return component?.events ?? [];
    }
    const component = roots.find(
      (c): c is CustomComponent =>
        c.id === widget.customComponentId && c.type === 'customComponent',
    );
    return component?.events ?? [];
  })();

  const handleAddEvent = (eventKey: string) => () => {
    const eventType = 'update-variable';
    const defaultEvent = EventModel.getDefaultEvent(eventType);
    dispatch(addWidgetEvent(eventKey, defaultEvent));
  };

  const handleRemoveEvent = (eventKey: string, index: number) => () => {
    dispatch(removeWidgetEvent(eventKey, index));
  };

  const handleEventTypeChange = (eventKey: string, index: number) => (e: SelectChangeEvent) => {
    const eventType = e.target.value as 'update-variable' | 'trigger-action' | 'navigate-page';
    const defaultEvent = EventModel.getDefaultEvent(eventType);
    dispatch(updateWidgetEvent(eventKey, index, defaultEvent));
  };

  const handleEventChange = (eventKey: string, index: number) => (event: Event) => {
    dispatch(updateWidgetEvent(eventKey, index, event));
  };

  const eventTypeOptions = eventTypes.map((et) => ({ value: et.key, label: et.label }));

  if (!rootId) return null;

  return (
    <Styles.Container>
      {eventConfig.map((e) => (
        <Styles.Event key={e.key}>
          <Styles.EventLabel>{e.label}</Styles.EventLabel>
          <IconButton onClick={handleAddEvent(e.key)} size="small">
            <AddSharp />
          </IconButton>
          {widget.events[e.key].map((ee, i) => (
            <Styles.EventInstance key={i}>
              <IconButton onClick={handleRemoveEvent(e.key, i)} size="small">
                <DeleteSharp />
              </IconButton>
              <FormControl fullWidth>
                <Select value={ee.type} onChange={handleEventTypeChange(e.key, i)}>
                  {eventTypeOptions.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {ee.type === 'update-variable' && (
                <UpdateVariableEventConfig event={ee} onChange={handleEventChange(e.key, i)} />
              )}
              {ee.type === 'trigger-action' && (
                <TriggerActionEventConfig
                  event={ee}
                  onChange={handleEventChange(e.key, i)}
                  pageId={rootId}
                  widgetId={widget.id}
                  eventKey={e.key}
                  eventInstanceIndex={i}
                />
              )}
              {ee.type === 'navigate-page' && (
                <NavigatePageEventConfig event={ee} onChange={handleEventChange(e.key, i)} />
              )}
            </Styles.EventInstance>
          ))}
        </Styles.Event>
      ))}
    </Styles.Container>
  );
};
