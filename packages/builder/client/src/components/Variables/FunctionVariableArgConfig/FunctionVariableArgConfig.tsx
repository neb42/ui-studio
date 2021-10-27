import * as React from 'react';
import { OpenAPIV3 } from 'openapi-types';
import { FunctionVariableArg, Value, Mode } from '@ui-studio/types';
import { ValueConfig } from 'components/ValueConfig';

import * as Styles from './FunctionVariableArgConfig.styles';

interface Props {
  rootId: string | null;
  name: string;
  schema: OpenAPIV3.SchemaObject;
  arg: FunctionVariableArg;
  onChange: (argName: string, arg: FunctionVariableArg) => void;
}

export const FunctionVariableArgConfig = ({
  rootId,
  name,
  schema,
  arg,
  onChange,
}: Props): JSX.Element => {
  const modeOptions: Mode[] = ['static', 'variable', 'widget'];

  const handleOnChange = (a: Value) => {
    if (a.mode === 'static' || a.mode === 'variable' || a.mode === 'widget')
      onChange(name, a as FunctionVariableArg);
  };

  const handleModeChange = (m: Mode) => {
    if (m === 'static') onChange(name, { mode: 'static', value: '' });
    if (m === 'variable') onChange(name, { mode: 'variable', variableId: '' });
    if (m === 'widget') onChange(name, { mode: 'widget', widgetId: '', property: '' });
  };

  return (
    <Styles.Container>
      <ValueConfig
        id="" // Not used
        rootId={rootId}
        name={name}
        schema={schema}
        defaultValue=""
        mode={arg.mode}
        value={arg}
        modeOptions={modeOptions}
        handleModeChange={handleModeChange}
        handleValueChange={handleOnChange}
      />
    </Styles.Container>
  );
};
