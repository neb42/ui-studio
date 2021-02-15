import * as React from 'react';
import { useDispatch } from 'react-redux';
import Select from '@faculty/adler-web-components/atoms/Select';
import Slider from '@faculty/adler-web-components/atoms/Slider/Slider';
import { Widget, Layout, FlexJustification, FlexAlignment, IFlexStyle } from 'canvas-types';
import { updateLayoutStyle } from 'actions/layout';
import { updateWidgetStyle } from 'actions/widget';

import * as Styles from './FlexParentStyle.styles';

const alignmentOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'flex-start', label: 'Start' },
  { value: 'flex-end', label: 'End' },
  { value: 'center', label: 'Center' },
  { value: 'stretch', label: 'Stretch' },
  { value: 'baseline', label: 'Baseline' },
];

const justificationOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'flex-start', label: 'Start' },
  { value: 'flex-end', label: 'End' },
  { value: 'center', label: 'Center' },
  { value: 'space-between', label: 'Space between' },
];

interface FlexParentStyleProps {
  element: Widget | Layout;
}

export const FlexParentStyle = ({ element }: FlexParentStyleProps): JSX.Element => {
  const dispatch = useDispatch();

  if (element.style.type !== 'flex') throw Error();

  const handleUpdateAlignment = ({ value }: any) => {
    if (element.style.type !== 'flex') throw Error();

    const style: IFlexStyle = {
      ...element.style,
      align: value as FlexAlignment,
    };

    if (element.type === 'widget') {
      dispatch(updateWidgetStyle(element.id, style));
    }

    if (element.type === 'layout') {
      dispatch(updateLayoutStyle(element.id, style));
    }
  };

  const handleUpdateJustification = ({ value }: any) => {
    if (element.style.type !== 'flex') throw Error();

    const style: IFlexStyle = {
      ...element.style,
      justify: value as FlexJustification,
    };

    if (element.type === 'widget') {
      dispatch(updateWidgetStyle(element.id, style));
    }

    if (element.type === 'layout') {
      dispatch(updateLayoutStyle(element.id, style));
    }
  };

  const handleUpdateGrow = (grow: number) => {
    if (element.style.type !== 'flex') throw Error();

    const style: IFlexStyle = {
      ...element.style,
      grow,
    };

    if (element.type === 'widget') {
      dispatch(updateWidgetStyle(element.id, style));
    }

    if (element.type === 'layout') {
      dispatch(updateLayoutStyle(element.id, style));
    }
  };

  const { grow, align, justify } = element.style;

  return (
    <Styles.Container>
      <Styles.Field>
        <Styles.FieldHeader>Grow</Styles.FieldHeader>
        <Slider
          value={grow}
          onChangeComplete={handleUpdateGrow}
          minValue={0}
          maxValue={10}
          step={1}
        />
      </Styles.Field>
      <Styles.Field>
        <Styles.FieldHeader>Alignment</Styles.FieldHeader>
        <Select
          value={alignmentOptions.find((o) => o.value === align)}
          onChange={handleUpdateAlignment}
          options={alignmentOptions}
        />
      </Styles.Field>
      <Styles.Field>
        <Styles.FieldHeader>Justification</Styles.FieldHeader>
        <Select
          value={justificationOptions.find((o) => o.value === justify)}
          onChange={handleUpdateJustification}
          options={justificationOptions}
        />
      </Styles.Field>
    </Styles.Container>
  );
};
