import * as React from 'react';
import { useTheme } from 'styled-components';
import AceEditor from 'react-ace';
import Input from '@faculty/adler-web-components/atoms/Input';
import Select from '@faculty/adler-web-components/atoms/Select';
import Checkbox from '@faculty/adler-web-components/atoms/Checkbox';
import {
  ComponentConfig,
  WidgetProp$Static,
  WidgetProp$Variable,
  WidgetProp$Widget,
} from '@ui-studio/types';

interface StaticConfigProps {
  label?: string;
  widgetProp: WidgetProp$Static;
  config: ComponentConfig;
  onChange: (value: WidgetProp$Static | WidgetProp$Variable | WidgetProp$Widget) => void;
}

export const StaticConfig = ({
  widgetProp,
  config,
  onChange,
  label,
}: StaticConfigProps): JSX.Element => {
  const theme = useTheme();
  const [hasFocus, setHasFocus] = React.useState(false);

  if (widgetProp.mode !== 'static')
    throw Error(`Trying to render static config editor for ${widgetProp.mode} prop`);

  const buildStaticWidgetProp = (v: string | number | boolean): WidgetProp$Static => {
    if (config.list || config.component === 'complex') {
      return {
        mode: 'static',
        type: 'object',
        value: v.toString(),
        iterable: Boolean(config.iterable),
      };
    }
    switch (config.type) {
      case 'string':
        return { mode: 'static', type: 'string', value: v.toString(), iterable: false };
      case 'number':
        return { mode: 'static', type: 'number', value: Number(v), iterable: false };
      case 'boolean':
        return { mode: 'static', type: 'boolean', value: Boolean(v), iterable: false };
      case 'object':
        return {
          mode: 'static',
          type: 'object',
          value: v.toString(),
          iterable: Boolean(config.iterable),
        };
      default:
        throw Error();
    }
  };

  const handleInputOnChange = (value: string) => {
    onChange(buildStaticWidgetProp(value));
  };

  const handleSelectOnChange = ({ value }: any) => {
    onChange(buildStaticWidgetProp(value as string));
  };

  const handleCheckboxOnChange = (value: boolean) => {
    onChange(buildStaticWidgetProp(value));
  };

  const valueLabel = label || 'Value';

  if (config.list || config.component === 'complex') {
    if (typeof widgetProp.value !== 'string') throw Error();
    return (
      <AceEditor
        mode="json"
        theme="chrome"
        defaultValue={widgetProp.value}
        onChange={handleInputOnChange}
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="300px"
        tabSize={2}
        wrapEnabled
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        highlightActiveLine={false}
        showGutter={false}
        showPrintMargin={false}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
        style={{
          padding: '8px',
          border: `1px solid ${
            hasFocus ? theme.input.border.color.focused : theme.input.border.color.default
          }`,
          fontFamily: 'Menlo, monospace',
          transition: 'border 300ms ease-in-out',
        }}
      />
    );
  }

  switch (config.component) {
    case 'input':
      switch (config.type) {
        case 'string':
        case 'number': {
          if (typeof widgetProp.value === 'boolean') throw Error();
          return (
            <Input label={valueLabel} onChange={handleInputOnChange} value={widgetProp.value} />
          );
        }
        case 'boolean':
          if (typeof widgetProp.value !== 'boolean') throw Error();
          return (
            <Checkbox checked={widgetProp.value} onChange={handleCheckboxOnChange} controlled>
              {config.label}
            </Checkbox>
          );
        case 'object':
          if (typeof widgetProp.value !== 'string') throw Error();
          return (
            <AceEditor
              mode="json"
              theme="chrome"
              defaultValue={widgetProp.value}
              onChange={handleInputOnChange}
              editorProps={{ $blockScrolling: true }}
              width="100%"
              height="300px"
              tabSize={2}
              wrapEnabled
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
              highlightActiveLine={false}
              showGutter={false}
              showPrintMargin={false}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
              style={{
                padding: '8px',
                border: `1px solid ${
                  hasFocus ? theme.input.border.color.focused : theme.input.border.color.default
                }`,
                fontFamily: 'Menlo, monospace',
                transition: 'border 300ms ease-in-out',
              }}
            />
          );
        default:
          throw Error();
      }
    case 'select': {
      // Types are weird
      const v = (() => {
        if (
          (config.type === 'string' || config.type === 'object') &&
          typeof widgetProp.value === 'string'
        ) {
          return config.options.find((o) => o.key === widgetProp.value);
        }
        if (config.type === 'number' && typeof widgetProp.value === 'number') {
          return config.options.find((o) => o.key === widgetProp.value);
        }
        if (config.type === 'boolean' && typeof widgetProp.value === 'boolean') {
          return config.options.find((o) => o.key === widgetProp.value);
        }
        throw Error();
      })();
      return (
        <Select
          label={valueLabel}
          value={v ? { value: v.key, label: v.label } : null}
          onChange={handleSelectOnChange}
          options={config.options.map((o: any) => ({ value: o.key, label: o.label }))}
        />
      );
    }
    // case 'checkbox':
    // case 'slider':
    // case 'multislider':
    default:
      return <div />;
  }
};
