import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '@faculty/adler-web-components/atoms/Input';
import Select from '@faculty/adler-web-components/atoms/Select';
import { updateVariableName, updateVariableType } from 'actions/variable';
import { makeGetSelectedVariable } from 'selectors/element';
import { StaticVariableConfig } from 'components/Variables/StaticVariableConfig';
import { FunctionVariableConfig } from 'components/Variables/FunctionVariableConfig';

import * as Styles from './VariableConfig.styles';

const variableTypeOptions = [
  { value: 'static', label: 'Static' },
  { value: 'function', label: 'Function' },
];

export const VariableConfig = () => {
  const dispatch = useDispatch();
  const selectedVariable = useSelector(React.useMemo(makeGetSelectedVariable, []));

  const handleOnNameChange = (name: string) => {
    if (selectedVariable) {
      dispatch(updateVariableName(selectedVariable.id, name));
    }
  };

  const handleOnTypeChange = ({ value }: any) => {
    if (selectedVariable) {
      dispatch(updateVariableType(selectedVariable.id, value as 'static' | 'function'));
    }
  };

  if (!selectedVariable) return <div />;

  return (
    <Styles.Container>
      <Input
        label="Name"
        value={selectedVariable.name}
        onChange={handleOnNameChange}
        error={selectedVariable.name.length === 0 ? 'Required' : undefined}
      />
      <Select
        label="Type"
        value={variableTypeOptions.find((o) => o.value === selectedVariable?.type)}
        onChange={handleOnTypeChange}
        options={variableTypeOptions}
      />
      {selectedVariable?.type === 'static' && <StaticVariableConfig variable={selectedVariable} />}
      {selectedVariable?.type === 'function' && (
        <FunctionVariableConfig variable={selectedVariable} />
      )}
    </Styles.Container>
  );
};
