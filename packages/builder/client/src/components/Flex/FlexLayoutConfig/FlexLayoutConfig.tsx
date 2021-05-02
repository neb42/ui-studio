import * as React from 'react';
import { useDispatch } from 'react-redux';
import Select from '@faculty/adler-web-components/atoms/Select';
import Checkbox from '@faculty/adler-web-components/atoms/Checkbox';
import { Widget, FlexJustification, FlexAlignment } from '@ui-studio/types';
import { updateWidgetLayoutConfig } from 'actions/tree/layout';
import { AlignmentButton } from 'components/AlignmentButton';

import * as Styles from './FlexLayoutConfig.styles';

const directionOptions = [
  { value: 'row', label: 'Row' },
  { value: 'column', label: 'Column' },
];

interface FlexLayoutConfigProps {
  widget: Widget;
}

export const FlexLayoutConfig = ({ widget }: FlexLayoutConfigProps): JSX.Element => {
  const dispatch = useDispatch();

  if (widget.layout?.type !== 'flex') throw Error();

  const handleUpdateDirection = ({ value }: any) => {
    dispatch(updateWidgetLayoutConfig('direction', value as 'row' | 'column'));
  };

  const handleUpdateAlignment = (value: string) => {
    dispatch(updateWidgetLayoutConfig('align', value as FlexAlignment));
  };

  const handleUpdateJustification = (value: string) => {
    dispatch(updateWidgetLayoutConfig('justify', value as FlexJustification));
  };

  const handleUpdateWrap = (wrap: boolean) => {
    dispatch(updateWidgetLayoutConfig('wrap', wrap));
  };

  const { direction } = widget.layout;
  return (
    <Styles.Container>
      <Styles.Field>
        <Styles.FieldHeader>Direction</Styles.FieldHeader>
        <Select
          value={directionOptions.find((o) => o.value === direction)}
          onChange={handleUpdateDirection}
          options={directionOptions}
        />
      </Styles.Field>
      <Styles.Field>
        <Styles.FieldHeader>Alignment</Styles.FieldHeader>
        <AlignmentButton
          layoutType="flex"
          direction={direction}
          alignmentType="align"
          value={widget.layout.align}
          onChange={handleUpdateAlignment}
        />
      </Styles.Field>
      <Styles.Field>
        <Styles.FieldHeader>Justification</Styles.FieldHeader>
        <AlignmentButton
          layoutType="flex"
          direction={direction}
          alignmentType="justify"
          value={widget.layout.justify}
          onChange={handleUpdateJustification}
        />
      </Styles.Field>
      <Styles.Field>
        <Checkbox checked={widget.layout.wrap} onChange={handleUpdateWrap} controlled>
          Wrap
        </Checkbox>
      </Styles.Field>
    </Styles.Container>
  );
};
