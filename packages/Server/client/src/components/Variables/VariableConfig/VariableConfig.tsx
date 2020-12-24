import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Select, MenuItem } from '@material-ui/core';
import { updateVariableName, updateVariableType } from 'actions/variable';
import { makeGetSelectedVariable } from 'selectors/element';
import { StaticVariableConfig } from 'components/Variables/StaticVariableConfig';
import { FunctionVariableConfig } from 'components/Variables/FunctionVariableConfig';

import * as Styles from './VariableConfig.styles';

export const VariableConfig = () => {
  const dispatch = useDispatch();
  const selectedVariable = useSelector(React.useMemo(makeGetSelectedVariable, []));
  const [name, setName] = React.useState(selectedVariable?.name ?? '');

  React.useEffect(() => {
    if (selectedVariable && selectedVariable.name !== name) {
      setName(selectedVariable.name);
    }
  }, [selectedVariable?.name]);

  const handleOnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event?.target?.value ?? '';
    setName(newName);
  };

  const handleOnNameBlur = () => {
    if (selectedVariable) {
      dispatch(updateVariableName(selectedVariable.id, name));
    }
  };

  const handleOnTypeChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>,
  ) => {
    if (selectedVariable) {
      dispatch(
        updateVariableType(selectedVariable.id, event.target.value as 'static' | 'function'),
      );
    }
  };

  if (!selectedVariable) return <div>empty state</div>;

  return (
    <Styles.Container>
      <Styles.Name>
        <TextField
          id="name"
          label="Name"
          value={name}
          required
          onChange={handleOnNameChange}
          onBlur={handleOnNameBlur}
          error={name.length === 0}
        />
      </Styles.Name>
      <Styles.Type>
        <Select value={selectedVariable?.type} onChange={handleOnTypeChange}>
          <MenuItem value="static">Static</MenuItem>
          <MenuItem value="function">Function</MenuItem>
        </Select>
      </Styles.Type>
      {selectedVariable?.type === 'static' && <StaticVariableConfig variable={selectedVariable} />}
      {selectedVariable?.type === 'function' && (
        <FunctionVariableConfig variable={selectedVariable} />
      )}
    </Styles.Container>
  );
};
