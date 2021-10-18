import * as React from 'react';
import { OpenAPIV3 } from 'openapi-types';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import { AddSharp, DeleteSharp } from '@mui/icons-material';
import Select from '@faculty/adler-web-components/atoms/Select';
import {
  Event,
  Event$UpdateVariable,
  Event$TriggerAction,
  Event$NavigatePage,
  Widget,
  Page,
  CustomComponentInstance,
  CustomComponent,
  Value$Static,
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

  const handleOnChange = ({ value }: any) => {
    onChange({ type: 'update-variable', variableId: value as string });
  };

  const options = eventFunctionVariables.map((v) => ({ value: v.id, label: v.name }));

  return (
    <Select
      value={options.find((o) => o.value === event.variableId)}
      options={options}
      onChange={handleOnChange}
    />
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

  const handleActionChange = ({ value }: any) => {
    const newActionId = value as { method: OpenAPIV3.HttpMethods; path: string };
    const args = EventModel.getDefaultFunctionArgs(
      argTypeLookUp,
      newActionId.path,
      newActionId.method,
    );
    onChange({ type: 'trigger-action', actionId: newActionId, args });
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
      <Select
        value={options.find(
          (o) => o.value.method === event.actionId.method && o.value.path === event.actionId.path,
        )}
        options={options}
        onChange={handleActionChange}
      />
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

  const handleOnChange = ({ value }: any) => {
    onChange({ type: 'navigate-page', pageId: value as string });
  };

  const options = pages.map((p) => ({ value: p.name, label: p.name }));

  return (
    <Select
      value={options.find((o) => o.value === event.pageId)}
      options={options}
      onChange={handleOnChange}
    />
  );
};

const eventTypes = [
  { key: 'update-variable', label: 'Update variable' },
  { key: 'trigger-action', label: 'Trigger action' },
  { key: 'navigate-page', label: 'Navigate page' },
];

const buildDefaultEvent = (
  eventType: 'update-variable' | 'reset-variable' | 'trigger-action' | 'navigate-page',
): Event => {
  switch (eventType) {
    case 'update-variable':
      return { type: eventType, variableId: '' };
    case 'trigger-action':
      return {
        type: eventType,
        actionId: { path: '', method: OpenAPIV3.HttpMethods.POST },
        args: {
          path: {},
          query: {},
          body: {},
        },
      };
    case 'navigate-page':
      return { type: eventType, pageId: '' };
    default:
      throw Error();
  }
};

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
    const defaultEvent = buildDefaultEvent(eventType);
    dispatch(addWidgetEvent(eventKey, defaultEvent));
  };

  const handleRemoveEvent = (eventKey: string, index: number) => () => {
    dispatch(removeWidgetEvent(eventKey, index));
  };

  const handleEventTypeChange = (eventKey: string, index: number) => ({ value }: any) => {
    const eventType = value as 'update-variable' | 'trigger-action' | 'navigate-page';
    const defaultEvent = buildDefaultEvent(eventType);
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
              <Select
                value={eventTypeOptions.find((o) => o.value === ee.type)}
                options={eventTypeOptions}
                onChange={handleEventTypeChange(e.key, i)}
              />
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
