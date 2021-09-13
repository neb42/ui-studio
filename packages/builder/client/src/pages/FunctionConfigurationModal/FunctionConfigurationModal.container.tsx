import * as React from 'react';
import { Modal } from '@faculty/adler-web-components';
import { OpenAPIV3 } from 'openapi-types';
import { Event$TriggerAction, FunctionVariable, FunctionVariableArg } from '@ui-studio/types';
import { closeModal } from 'actions/modal';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from 'types/store';

import { FunctionConfigurationModalComponent } from './FunctionConfigurationModal.component';

type Props = {};

export const FunctionConfigurationModalContainer = ({}: Props) => {
  const dispatch = useDispatch();

  const { open, type, id, path, method } = useSelector<
    Store,
    Store['view']['modal']['functionConfiguration']
  >((state) => state.view.modal.functionConfiguration);

  const config = useSelector<Store, FunctionVariable | Event$TriggerAction | null>((state) => {
    if (!open || !type || !id || !path || !method) return null;

    if (type === 'function') {
      const variable = state.variable[id];
      if (variable.type !== 'function') throw new Error();
      return variable;
    }
    if (type === 'action') {
      const action = state.widget[id][id].events[id][0];
      if (action.type !== 'trigger-action') throw new Error();
      return action;
    }
    throw new Error();
  });

  const schema = useSelector<Store, OpenAPIV3.OperationObject | null>((state) => {
    if (!path || !method) return null;
    return state.configuration.openAPISchema.paths?.[path]?.[method] ?? null;
  });

  const handleCloseModal = () => dispatch(closeModal);

  const handlePathParamChange = (key: string, arg: FunctionVariableArg) => {};

  const handleQueryStringParamChange = (key: string, arg: FunctionVariableArg) => {};

  const handleBodyParamChange = (key: string, arg: FunctionVariableArg) => {};

  if (!open || !type || !id || !path || !method || !config || !schema) return null;

  return (
    <Modal title="Modal" show={open} onHide={handleCloseModal}>
      <FunctionConfigurationModalComponent
        path={path}
        method={method}
        schema={schema}
        config={config}
        onPathParamChange={handlePathParamChange}
        onQueryStringParamChange={handleQueryStringParamChange}
        onBodyParamChange={handleBodyParamChange}
      />
    </Modal>
  );
};
