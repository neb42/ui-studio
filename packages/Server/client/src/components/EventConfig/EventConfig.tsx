import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Select, MenuItem } from '@material-ui/core';
import { AddSharp, DeleteSharp } from '@material-ui/icons';
import {
  Event,
  Event$UpdateVariable,
  Event$TriggerAction,
  Event$NavigatePage,
  FunctionVariableArg,
  Widget,
} from '@ui-builder/types';
import { makeGetComponents, getVariables, makeGetActions, getPages } from 'selectors/element';
import { addWidgetEvent, updateWidgetEvent, removeWidgetEvent } from 'actions/widget';
import { FunctionVariableArgConfig } from 'components/Variables/FunctionVariableArgConfig';

import * as Styles from './EventConfig.styles';

type InputEvent = React.ChangeEvent<HTMLInputElement>;
type SelectEvent = React.ChangeEvent<{
  name?: string | undefined;
  value: unknown;
}>;

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

  const handleOnChange = (e: SelectEvent) => {
    onChange({ type: 'update-variable', variableId: e.target.value as string });
  };

  return (
    <Select value={event.variableId} onChange={handleOnChange} style={{ width: '100%' }}>
      {eventFunctionVariables.map((v) => (
        <MenuItem key={v.id} value={v.id}>
          {v.name}
        </MenuItem>
      ))}
    </Select>
  );
};

const TriggerActionEventConfig = ({
  event,
  onChange,
}: EventConfigInstanceProps<Event$TriggerAction>): JSX.Element => {
  const actions = useSelector(React.useMemo(makeGetActions, []));

  const selectedAction = actions.find((a) => a.name === event.actionId);

  const handleActionChange = (e: SelectEvent) => {
    const newActionId = e.target.value as string;
    const newSelectedAction = actions.find((a) => a.name === newActionId);
    if (!newSelectedAction) return;
    const args: FunctionVariableArg[] = newSelectedAction.args.map((a) => {
      switch (a.type) {
        case 'string':
          return { type: 'static', valueType: 'string', value: '' };
        case 'number':
          return { type: 'static', valueType: 'number', value: 0 };
        case 'boolean':
          return { type: 'static', valueType: 'boolean', value: true };
        default:
          throw Error();
      }
    });
    onChange({ type: 'trigger-action', actionId: newActionId, args });
  };

  const handleArgChange = (index: number) => (_: string, arg: FunctionVariableArg) => {
    const newArgs = [...event.args];
    newArgs[index] = arg;
    onChange({ type: 'trigger-action', actionId: event.actionId, args: newArgs });
  };

  return (
    <>
      <Select value={event.actionId} onChange={handleActionChange} style={{ width: '100%' }}>
        {actions.map((a) => (
          <MenuItem key={a.name} value={a.name}>
            {a.name}
          </MenuItem>
        ))}
      </Select>
      {selectedAction &&
        selectedAction.args.map((a, i) => (
          <FunctionVariableArgConfig
            key={a.name}
            onChange={handleArgChange(i)}
            name={a.name}
            valueType={a.type}
            arg={event.args[i]}
          />
        ))}
    </>
  );
};

const NavigatePageEventConfig = ({
  event,
  onChange,
}: EventConfigInstanceProps<Event$NavigatePage>): JSX.Element => {
  const pages = Object.values(useSelector(getPages));

  const handleOnChange = (e: SelectEvent) => {
    onChange({ type: 'navigate-page', pageId: e.target.value as string });
  };

  return (
    <Select value={event.pageId} onChange={handleOnChange} style={{ width: '100%' }}>
      {pages.map((p) => (
        <MenuItem key={p.id} value={p.name}>
          {p.name}
        </MenuItem>
      ))}
    </Select>
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
      return { type: eventType, actionId: '', args: [] };
    case 'navigate-page':
      return { type: eventType, pageId: '' };
    default:
      throw Error();
  }
};

interface EventConfigProps {
  widget: Widget;
}

export const EventConfig = ({ widget }: EventConfigProps): JSX.Element => {
  const dispatch = useDispatch();

  const components = useSelector(React.useMemo(makeGetComponents, []));
  const eventConfig = components.find((c) => c.name === widget.component)?.events ?? [];

  const handleAddEvent = (eventKey: string) => () => {
    const eventType = 'update-variable';
    const defaultEvent = buildDefaultEvent(eventType);
    dispatch(addWidgetEvent(widget.id, eventKey, defaultEvent));
  };

  const handleRemoveEvent = (eventKey: string, index: number) => () => {
    dispatch(removeWidgetEvent(widget.id, eventKey, index));
  };

  const handleEventTypeChange = (eventKey: string, index: number) => (event: SelectEvent) => {
    const eventType = event.target.value as 'update-variable' | 'trigger-action' | 'navigate-page';
    const defaultEvent = buildDefaultEvent(eventType);
    dispatch(updateWidgetEvent(widget.id, eventKey, index, defaultEvent));
  };

  const handleEventChange = (eventKey: string, index: number) => (event: Event) => {
    dispatch(updateWidgetEvent(widget.id, eventKey, index, event));
  };

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
                value={ee.type}
                onChange={handleEventTypeChange(e.key, i)}
                style={{ width: '100%' }}
              >
                {eventTypes.map((et) => (
                  <MenuItem key={et.key} value={et.key}>
                    {et.label}
                  </MenuItem>
                ))}
              </Select>
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
