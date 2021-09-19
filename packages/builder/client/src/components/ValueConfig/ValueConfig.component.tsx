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

type Foo =
  | {
      mode: 'form';
      value: Value$List | Value$Complex;
    }
  | {
      mode: 'static';
      value: Value$Static;
    }
  | {
      mode: 'variable';
      value: Value$Variable;
    }
  | {
      mode: 'widget';
      value: Value$Widget;
    }
  | {
      mode: 'iterable';
      value: Value$Iterable;
    }
  | {
      mode: 'customComponentConfig';
      value: Value$CustomComponentConfig;
    };

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
    const newProp = {
      mode: schema.type === 'object' ? 'complex' : 'static',
      value: defaultValue,
    };
    handleValueChange({
      ...value,
      props: [...value.props, newProp],
    } as Value$List);
  };

  const handleDeletePropFromList = (index: number) => () => {
    if (value.mode !== 'list') throw Error();
    handleValueChange({
      ...value,
      props: value.props.filter((_, i) => i !== index),
    } as Value$List);
  };

  return (
    <Styles.Container>
      <Styles.Name>{name}</Styles.Name>
      <ModeButtons mode={mode} modeOptions={modeOptions} onModeChange={handleModeChange} />
      <ValueItem mode={mode} value={value} schema={schema} handleValueChange={handleValueChange} />
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
