import * as React from 'react';
import { OpenAPIV3 } from 'openapi-types';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { AddSharp, DeleteSharp } from '@material-ui/icons';
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
  FunctionVariable$StaticArg,
} from '@ui-studio/types';
import { getComponents, getActions, getArgTypeLookUp } from 'selectors/configuration';
import { getRoots } from 'selectors/tree';
import { getVariables } from 'selectors/variable';
import { addWidgetEvent, updateWidgetEvent, removeWidgetEvent } from 'actions/event';

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
}: EventConfigInstanceProps<Event$TriggerAction>): JSX.Element => {
  const actions = useSelector(getActions);
  const argTypeLookUp = useSelector(getArgTypeLookUp);

  const handleActionChange = ({ value }: any) => {
    const newActionId = value as { method: OpenAPIV3.HttpMethods; path: string };
    const staticArgTypeMap: {
      [argType in 'string' | 'number' | 'boolean']: FunctionVariable$StaticArg;
    } = {
      string: { type: 'static', valueType: 'string', value: '' },
      number: { type: 'static', valueType: 'number', value: 0 },
      boolean: { type: 'static', valueType: 'boolean', value: true },
    };
    const args = {
      path: Object.keys(argTypeLookUp.path[newActionId.path][newActionId.method]).reduce(
        (acc, cur) => {
          return {
            ...acc,
            [cur]: staticArgTypeMap[argTypeLookUp.path[newActionId.path][newActionId.method][cur]],
          };
        },
        {},
      ),
      query: Object.keys(argTypeLookUp.query[newActionId.path][newActionId.method]).reduce(
        (acc, cur) => {
          return {
            ...acc,
            [cur]: staticArgTypeMap[argTypeLookUp.query[newActionId.path][newActionId.method][cur]],
          };
        },
        {},
      ),
      body: Object.keys(argTypeLookUp.body[newActionId.path][newActionId.method]).reduce(
        (acc, cur) => {
          return {
            ...acc,
            [cur]: staticArgTypeMap[argTypeLookUp.body[newActionId.path][newActionId.method][cur]],
          };
        },
        {},
      ),
    };
    onChange({ type: 'trigger-action', actionId: newActionId, args });
  };

  // const handleArgChange = (index: number) => (_: string, arg: FunctionVariableArg) => {
  //   const newArgs = [...event.args];
  //   newArgs[index] = arg;
  //   onChange({ type: 'trigger-action', actionId: event.actionId, args: newArgs });
  // };

  const options = actions.map((a) => ({ value: a, label: `${a.method.toUpperCase()} ${a.path}` }));

  return (
    <Select
      value={options.find(
        (o) => o.value.method === event.actionId.method && o.value.path === event.actionId.path,
      )}
      options={options}
      onChange={handleActionChange}
    />
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

export const EventConfig = ({ widget }: EventConfigProps): JSX.Element => {
  const dispatch = useDispatch();

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
                <TriggerActionEventConfig event={ee} onChange={handleEventChange(e.key, i)} />
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
