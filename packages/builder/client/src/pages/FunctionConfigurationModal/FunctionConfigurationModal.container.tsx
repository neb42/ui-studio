import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { OpenAPIV3 } from 'openapi-types';
import { Event$TriggerAction, FunctionVariable, FunctionVariableArg } from '@ui-studio/types';
import { closeModal } from 'actions/modal';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from 'types/store';
import { updateFunctionVariable } from 'actions/variable';
import { updateWidgetEvent } from 'actions/event';

import { FunctionConfigurationModalComponent } from './FunctionConfigurationModal.component';

type Props = {};

export const FunctionConfigurationModalContainer = ({}: Props) => {
  const dispatch = useDispatch();

  const modalConfig = useSelector<Store, Store['view']['modal']['functionConfiguration']>(
    (state) => state.view.modal.functionConfiguration,
  );

  const config = useSelector<Store, FunctionVariable | Event$TriggerAction | null>((state) => {
    if (!modalConfig.open) return null;

    if (modalConfig.type === 'function') {
      const variable = state.variable[modalConfig.id];
      if (variable.type !== 'function') throw new Error();
      return variable;
    }
    if (modalConfig.type === 'action') {
      const actionEvent =
        state.widget[modalConfig.id[0]][modalConfig.id[1]].events[modalConfig.id[2]][
          modalConfig.id[3]
        ];
      if (actionEvent.type !== 'trigger-action') throw new Error();
      return actionEvent;
    }
    throw new Error();
  });

  const schema = useSelector<Store, OpenAPIV3.OperationObject | null>((state) => {
    if (!modalConfig.open) return null;
    return (
      state.configuration.openAPISchema.paths?.[modalConfig.path]?.[modalConfig.method] ?? null
    );
  });

  if (!modalConfig.open || !config || !schema) return null;

  const handleArgChange = (
    argType: keyof FunctionVariable['args'],
    argKey: string,
    arg: FunctionVariableArg,
  ) => {
    if (!modalConfig.open) return;
    if (config.type === 'function') {
      const args = {
        ...config.args,
        [argType]: {
          ...config.args[argType],
          [argKey]: arg,
        },
      };
      dispatch(updateFunctionVariable(config.id, config.functionId, config.trigger, args));
    } else if (modalConfig.type === 'action' && config.type === 'trigger-action') {
      const event: Event$TriggerAction = {
        ...config,
        args: {
          ...config.args,
          [argType]: {
            ...config.args[argType],
            [argKey]: arg,
          },
        },
      };
      dispatch(updateWidgetEvent(modalConfig.id[2], modalConfig.id[3], event));
    }
  };

  const handleCloseModal = () => dispatch(closeModal());

  const handlePathParamChange = (argKey: string, arg: FunctionVariableArg) =>
    handleArgChange('path', argKey, arg);

  const handleQueryStringParamChange = (argKey: string, arg: FunctionVariableArg) =>
    handleArgChange('query', argKey, arg);

  const handleBodyParamChange = (argKey: string, arg: FunctionVariableArg) =>
    handleArgChange('body', argKey, arg);

  return (
    <Dialog
      title={`${modalConfig.method.toUpperCase()} ${modalConfig.path}`}
      open={modalConfig.open}
      onClose={handleCloseModal}
      scroll="paper"
    >
      <DialogTitle>
        {modalConfig.method.toUpperCase()} {modalConfig.path}
      </DialogTitle>
      <DialogContent dividers>
        <FunctionConfigurationModalComponent
          schema={schema}
          config={config}
          onPathParamChange={handlePathParamChange}
          onQueryStringParamChange={handleQueryStringParamChange}
          onBodyParamChange={handleBodyParamChange}
        />
      </DialogContent>
    </Dialog>
  );
};
