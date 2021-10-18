import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteSharp from '@mui/icons-material/DeleteSharp';
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
import { OpenAPIV3 } from 'openapi-types';

import { StaticValue } from './StaticValue.component';
import { VariableValue } from './VariableValue.component';
import { WidgetValue } from './WidgetValue.component';
import { IterableValue } from './IterableValue.component';
import { CustomComponentValue } from './CustomComponentValue.component';
import * as Styles from './ValueConfig.styles';

type Props = {
  id: string;
  mode: Mode;
  value:
    | Value$List
    | Value$Complex
    | Value$Static
    | Value$Variable
    | Value$Widget
    | Value$Iterable
    | Value$CustomComponentConfig;
  schema: OpenAPIV3.SchemaObject;
  handleValueChange: (value: Props['value']) => any;
  root: boolean;
};

export const ValueItem = ({ id, mode, schema, value, handleValueChange, root }: Props) => {
  if (mode === 'form') {
    if (schema.type === 'array') {
      if (value.mode !== 'list') throw new Error();
      if ('ref' in schema.items) throw new Error();
      const items = schema.items as OpenAPIV3.SchemaObject;

      const handleDeletePropFromList = (index: number) => () => {
        if (value.mode !== 'list') throw Error();
        handleValueChange({
          ...value,
          props: value.props.filter((_, i) => i !== index),
        } as Value$List);
      };

      return (
        <>
          {value.props.map((v, i) => {
            if (items.type === 'object') {
              if (v.mode !== 'complex') throw new Error();
              return (
                <Styles.ValueItem key={i} root={root} direction="row">
                  <ValueItem
                    id={id}
                    mode="form"
                    schema={items}
                    value={v}
                    handleValueChange={(val) =>
                      handleValueChange({
                        ...value,
                        props: value.props.map((p, j) => (j === i ? (val as Value$Complex) : p)),
                      })
                    }
                    root={false}
                  />
                  <IconButton onClick={handleDeletePropFromList(i)} size="small">
                    <DeleteSharp />
                  </IconButton>
                </Styles.ValueItem>
              );
            }
            if (v.mode !== 'static') throw new Error();
            return (
              <Styles.ValueItem key={i} root={root} direction="row">
                <ValueItem
                  id={id}
                  mode="static"
                  schema={items}
                  value={v}
                  handleValueChange={(val) =>
                    handleValueChange({
                      ...value,
                      props: value.props.map((p, j) => (j === i ? (val as Value$Static) : p)),
                    })
                  }
                  root={false}
                />
                <IconButton onClick={handleDeletePropFromList(i)} size="small">
                  <DeleteSharp />
                </IconButton>
              </Styles.ValueItem>
            );
          })}
        </>
      );
    }

    if (schema.type === 'object') {
      if (value.mode !== 'complex') throw new Error();
      const { properties } = schema;
      if (!properties) throw new Error();
      return (
        <Styles.ValueItem root={root} direction="column">
          {Object.keys(properties).map((key) => {
            const nestedSchema = properties[key];
            if (!nestedSchema || 'ref' in nestedSchema) throw new Error();
            return (
              <ValueItem
                key={key}
                id={id}
                mode="static"
                schema={nestedSchema as OpenAPIV3.NonArraySchemaObject}
                value={value.props[key]}
                handleValueChange={(v) =>
                  handleValueChange({
                    ...value,
                    props: { ...value.props, [key]: v as Value$Static },
                  })
                }
                root={false}
              />
            );
          })}
        </Styles.ValueItem>
      );
    }

    throw new Error();
  }

  if (mode === 'static')
    return (
      <Styles.ValueItem root={root} direction="column">
        <StaticValue
          schema={schema}
          value={value as Value$Static}
          handleValueChange={handleValueChange}
        />
      </Styles.ValueItem>
    );

  if (mode === 'variable')
    return (
      <Styles.ValueItem root={root} direction="column">
        <VariableValue
          schema={schema}
          value={value as Value$Variable}
          handleValueChange={handleValueChange}
        />
      </Styles.ValueItem>
    );

  if (mode === 'widget')
    return (
      <Styles.ValueItem root={root} direction="column">
        <WidgetValue
          schema={schema}
          value={value as Value$Widget}
          handleValueChange={handleValueChange}
        />
      </Styles.ValueItem>
    );
  if (mode === 'iterable')
    return (
      <Styles.ValueItem root={root} direction="column">
        <IterableValue
          id={id}
          schema={schema}
          value={value as Value$Iterable}
          handleValueChange={handleValueChange}
        />
      </Styles.ValueItem>
    );

  if (mode === 'customComponentConfig')
    return (
      <Styles.ValueItem root={root} direction="column">
        <CustomComponentValue
          schema={schema}
          value={value as Value$CustomComponentConfig}
          handleValueChange={handleValueChange}
        />
      </Styles.ValueItem>
    );

  return null;
};
