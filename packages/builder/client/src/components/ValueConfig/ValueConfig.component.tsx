import * as React from 'react';
import Button from '@mui/material/Button';
import AddSharp from '@mui/icons-material/AddSharp';
import { OpenAPIV3 } from 'openapi-types';
import {
  Mode,
  Value$Complex,
  Value$CustomComponentConfig,
  Value$Iterable,
  Value$List,
  Value$Static,
  Value$Variable,
  Value$Widget,
} from '@ui-studio/types';
import { ModeButtons } from 'components/WidgetConfig/ModeButtons';
import { Outline } from 'components/Outline';

import * as Styles from './ValueConfig.styles';
import { ValueItem } from './ValueItem.component';

type Props = {
  id: string;
  rootId?: string | null;
  mode: Mode;
  value:
    | Value$List
    | Value$Complex
    | Value$Static
    | Value$Variable
    | Value$Widget
    | Value$Iterable
    | Value$CustomComponentConfig;
  name: string;
  defaultValue: any;
  schema: OpenAPIV3.SchemaObject;
  modeOptions: Mode[];
  handleModeChange: (mode: Mode) => any;
  handleValueChange: (
    value:
      | Value$List
      | Value$Complex
      | Value$Static
      | Value$Variable
      | Value$Widget
      | Value$Iterable
      | Value$CustomComponentConfig,
  ) => any;
};

export const ValueConfigComponent = ({
  id,
  rootId,
  name,
  schema,
  mode,
  value,
  defaultValue,
  modeOptions,
  handleModeChange,
  handleValueChange,
}: Props) => {
  const handleAddPropToList = () => {
    if (value.mode !== 'list') throw Error();
    if (schema.type !== 'array' || 'ref' in schema.items) throw new Error();
    const newProp =
      (schema.items as OpenAPIV3.SchemaObject).type === 'object'
        ? {
            mode: 'complex',
            props: Object.keys(defaultValue).reduce(
              (acc, cur) => ({
                ...acc,
                [cur]: { mode: 'static', value: defaultValue[cur] },
              }),
              {},
            ),
          }
        : {
            mode: 'static',
            value: defaultValue,
          };
    handleValueChange({
      ...value,
      props: [...value.props, newProp],
    } as Value$List);
  };

  return (
    <Outline label={name}>
      <Styles.Container>
        <ModeButtons mode={mode} modeOptions={modeOptions} onModeChange={handleModeChange} />
        <ValueItem
          id={id}
          rootId={rootId}
          mode={mode}
          value={value}
          schema={schema}
          handleValueChange={handleValueChange}
          root
        />
        {schema.type === 'array' && mode === 'form' && (
          <Button variant="outlined" onClick={handleAddPropToList} startIcon={<AddSharp />}>
            Add list item
          </Button>
        )}
      </Styles.Container>
    </Outline>
  );
};
