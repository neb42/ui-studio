import * as React from 'react';
import { Input, Select } from '@faculty/adler-web-components';
import { FunctionVariable, LookupVariable } from '@ui-studio/types';

type Props = {
  variable: LookupVariable;
  availableVariables: FunctionVariable[];
  onVariableIdChange: (variableId: string) => any;
  onLookupChange: (lookup: string) => any;
};

export const LookupVariableConfigComponent = ({
  variable,
  availableVariables,
  onVariableIdChange,
  onLookupChange,
}: Props) => {
  const options = availableVariables.map((v) => ({ value: v.id, label: v.name }));

  const handleVariableChange = ({ value }: any) => onVariableIdChange(value as string);

  return (
    <>
      <Select
        options={options}
        value={options.find((o) => o.value === variable.variableId)}
        onChange={handleVariableChange}
      />
      <Input value={variable.lookup} onChange={onLookupChange} />
    </>
  );
};
