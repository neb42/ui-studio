import * as React from 'react';
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
import { OpenAPIV3 } from 'openapi-types';
import { Button } from '@faculty/adler-web-components';

import * as Styles from './ValueConfig.styles';
import { ValueItem } from './ValueItem.component';

type Props = {
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
            props: defaultValue,
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
    <Styles.Container>
      <Styles.Name>{name}</Styles.Name>
      <ModeButtons mode={mode} modeOptions={modeOptions} onModeChange={handleModeChange} />
      <ValueItem
        mode={mode}
        value={value}
        schema={schema}
        handleValueChange={handleValueChange}
        root
      />
      {schema.type === 'array' && mode === 'form' && (
        <Button
          text="Add list item"
          icon="add"
          onClick={handleAddPropToList}
          style={Button.styles.outline}
          color={Button.colors.primary}
          size={Button.sizes.medium}
        />
      )}
    </Styles.Container>
  );
};