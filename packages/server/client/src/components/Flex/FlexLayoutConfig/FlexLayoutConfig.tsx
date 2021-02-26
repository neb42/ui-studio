import * as React from 'react';
import { useDispatch } from 'react-redux';
import Select from '@faculty/adler-web-components/atoms/Select';
import Checkbox from '@faculty/adler-web-components/atoms/Checkbox';
import { Layout, FlexJustification, FlexAlignment } from 'canvas-types';
import { updateLayoutConfig } from 'actions/layout';
import { AlignmentButton } from 'components/AlignmentButton';

import * as Styles from './FlexLayoutConfig.styles';

const directionOptions = [
  { value: 'row', label: 'Row' },
  { value: 'column', label: 'Column' },
];

interface FlexLayoutConfigProps {
  layout: Layout;
}

export const FlexLayoutConfig = ({ layout }: FlexLayoutConfigProps) => {
  const dispatch = useDispatch();

  if (layout.layoutType !== 'flex') throw Error();

  const handleUpdateDirection = ({ value }: any) => {
    dispatch(updateLayoutConfig(layout.id, 'direction', value as 'row' | 'column'));
  };

  const handleUpdateAlignment = (value: string) => {
    dispatch(updateLayoutConfig(layout.id, 'align', value as FlexAlignment));
  };

  const handleUpdateJustification = (value: string) => {
    dispatch(updateLayoutConfig(layout.id, 'justify', value as FlexJustification));
  };

  const handleUpdateWrap = (wrap: boolean) => {
    dispatch(updateLayoutConfig(layout.id, 'wrap', wrap));
  };

  return (
    <Styles.Container>
      <Styles.Field>
        <Styles.FieldHeader>Direction</Styles.FieldHeader>
        <Select
          value={directionOptions.find((o) => o.value === layout.props.direction)}
          onChange={handleUpdateDirection}
          options={directionOptions}
        />
      </Styles.Field>
      <Styles.Field>
        <Styles.FieldHeader>Alignment</Styles.FieldHeader>
        <AlignmentButton
          layoutType="flex"
          direction={layout.props.direction}
          alignmentType="align"
          value={layout.props.align}
          onChange={handleUpdateAlignment}
        />
      </Styles.Field>
      <Styles.Field>
        <Styles.FieldHeader>Justification</Styles.FieldHeader>
        <AlignmentButton
          layoutType="flex"
          direction={layout.props.direction}
          alignmentType="justify"
          value={layout.props.justify}
          onChange={handleUpdateJustification}
        />
      </Styles.Field>
      <Styles.Field>
        <Checkbox checked={layout.props.wrap} onChange={handleUpdateWrap} controlled>
          Wrap
        </Checkbox>
      </Styles.Field>
    </Styles.Container>
  );
};
