import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from '@faculty/adler-web-components/atoms/Slider/Slider';
import { Widget, Layout, FlexAlignment, IFlexStyle } from 'canvas-types';
import { updateLayoutStyle } from 'actions/layout';
import { updateWidgetStyle } from 'actions/widget';
import { AlignmentButton } from 'components/AlignmentButton';
import { getParentElement } from 'selectors/element';
import { Store } from 'types/store';

import * as Styles from './FlexParentStyle.styles';

interface FlexParentStyleProps {
  element: Widget | Layout;
}

export const FlexParentStyle = ({ element }: FlexParentStyleProps): JSX.Element => {
  const dispatch = useDispatch();

  const parent = useSelector((state: Store) => getParentElement(state, element.id));

  if (element.style.type !== 'flex' || parent?.type !== 'layout' || parent.layoutType !== 'flex')
    throw Error();

  const handleUpdateAlignment = (value: string) => {
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

  const { grow, align } = element.style;

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
        <AlignmentButton
          layoutType="flex"
          direction={parent.props.direction}
          alignmentType="self"
          value={align}
          onChange={handleUpdateAlignment}
        />
      </Styles.Field>
    </Styles.Container>
  );
};
