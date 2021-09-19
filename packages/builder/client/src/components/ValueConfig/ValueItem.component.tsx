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
import { OpenAPIV3 } from 'openapi-types';

import { StaticValue } from './StaticValue.component';
import { VariableValue } from './VariableValue.component';
import { WidgetValue } from './WidgetValue.component';
import { IterableValue } from './IterableValue.component';
import { CustomComponentValue } from './CustomComponentValue.component';
import * as Styles from './ValueConfig.styles';

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
  schema: OpenAPIV3.SchemaObject;
  handleValueChange: (value: Props['value']) => any;
};

export const ValueItem = ({ mode, schema, value, handleValueChange }: Props) => {
  if (mode === 'form') {
    if (schema.type === 'array') {
      if (value.mode !== 'list') throw new Error();
      if ('ref' in schema.items) throw new Error();
      const items = schema.items as OpenAPIV3.SchemaObject;
      return (
        <>
          {value.props.map((v, i) => {
            if (items.type === 'object') {
              if (v.mode !== 'complex') throw new Error();
              return (
                <Styles.ValueItem key={i}>
                  <ValueItem mode="form" schema={items} value={v} handleValueChange={() => {}} />
                </Styles.ValueItem>
              );
            }
            if (v.mode !== 'static') throw new Error();
            return (
              <Styles.ValueItem key={i}>
                <ValueItem mode="static" schema={items} value={v} handleValueChange={() => {}} />
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
        <Styles.ValueItem>
          {Object.keys(properties).map((key) => {
            const nestedSchema = properties[key];
            if (!nestedSchema || 'ref' in nestedSchema) throw new Error();
            return (
              <ValueItem
                key={key}
                mode="static"
                schema={nestedSchema as OpenAPIV3.NonArraySchemaObject}
                value={value.props[key]}
                handleValueChange={() => {}}
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
      <Styles.ValueItem>
        <StaticValue
          schema={schema}
          value={value as Value$Static}
          handleValueChange={handleValueChange}
        />
      </Styles.ValueItem>
    );

  if (mode === 'variable')
    return (
      <Styles.ValueItem>
        <VariableValue
          schema={schema}
          value={value as Value$Variable}
          handleValueChange={handleValueChange}
        />
      </Styles.ValueItem>
    );

  if (mode === 'widget')
    return (
      <Styles.ValueItem>
        <WidgetValue value={value as Value$Widget} handleValueChange={handleValueChange} />
      </Styles.ValueItem>
    );
  if (mode === 'iterable')
    return (
      <Styles.ValueItem>
        <IterableValue value={value as Value$Iterable} handleValueChange={handleValueChange} />
      </Styles.ValueItem>
    );

  if (mode === 'customComponentConfig')
    return (
      <Styles.ValueItem>
        <CustomComponentValue
          schema={schema}
          value={value as Value$CustomComponentConfig}
          handleValueChange={handleValueChange}
        />
      </Styles.ValueItem>
    );

  return null;
};
